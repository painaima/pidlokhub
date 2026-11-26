"""Shrink images to at most 1000 px on the long side, JPEG quality 80%.

Usage:
    python3 tools/resize_images.py รูป1.jpg รูป2.png        # resize files
    python3 tools/resize_images.py โฟลเดอร์รูป               # every image in a folder
    python3 tools/resize_images.py รูป.jpg --out ย่อแล้ว      # write to another folder
    python3 tools/resize_images.py รูป.jpg --max 1200 --quality 85

By default the result is saved next to the original as <name>-1000.jpg and the
original is kept. Prints the size of every file before and after.
Requires Pillow: pip install pillow
"""
from pathlib import Path
import argparse
import sys

from PIL import Image, ImageOps

IMAGE_TYPES = {'.jpg', '.jpeg', '.png', '.webp', '.heic', '.bmp', '.tif', '.tiff'}


def human(n):
    return f'{n / 1048576:.1f} MB' if n >= 1048576 else f'{max(1, round(n / 1024))} KB'


def collect(paths):
    for raw in paths:
        p = Path(raw)
        if p.is_dir():
            yield from sorted(x for x in p.iterdir() if x.suffix.lower() in IMAGE_TYPES)
        elif p.exists():
            yield p
        else:
            print(f'ไม่พบไฟล์: {p}', file=sys.stderr)


def resize(src, out_dir, max_px, quality):
    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im)  # keep phone photos the right way up
        before = im.size
        im.thumbnail((max_px, max_px), Image.LANCZOS)  # only shrinks, never enlarges
        if im.mode in ('RGBA', 'LA', 'P'):
            im = im.convert('RGBA')
            bg = Image.new('RGB', im.size, 'white')  # transparent areas become white
            bg.paste(im, mask=im.getchannel('A'))
            im = bg
        else:
            im = im.convert('RGB')
        target = (out_dir or src.parent) / f'{src.stem}-{max_px}.jpg'
        target.parent.mkdir(parents=True, exist_ok=True)
        im.save(target, 'JPEG', quality=quality, optimize=True, progressive=True)
    return before, im.size, target


def main():
    ap = argparse.ArgumentParser(description='ย่อรูปไม่เกิน 1000 px คุณภาพ 80% และแสดงขนาดไฟล์')
    ap.add_argument('paths', nargs='+', help='ไฟล์รูปหรือโฟลเดอร์')
    ap.add_argument('--out', type=Path, help='โฟลเดอร์ปลายทาง (ค่าเริ่มต้น: โฟลเดอร์เดียวกับต้นฉบับ)')
    ap.add_argument('--max', type=int, default=1000, help='ด้านยาวสูงสุด (px) ค่าเริ่มต้น 1000')
    ap.add_argument('--quality', type=int, default=80, help='คุณภาพ JPEG 1–95 ค่าเริ่มต้น 80')
    args = ap.parse_args()

    total_before = total_after = count = 0
    for src in collect(args.paths):
        if src.stem.endswith(f'-{args.max}'):
            continue  # already processed
        try:
            before, after, target = resize(src, args.out, args.max, args.quality)
        except Exception as e:  # unreadable or not an image
            print(f'ข้าม {src.name}: {e}', file=sys.stderr)
            continue
        b, a = src.stat().st_size, target.stat().st_size
        total_before += b
        total_after += a
        count += 1
        print(f'{src.name}: {before[0]}×{before[1]} {human(b)} → {after[0]}×{after[1]} {human(a)} '
              f'(-{100 - a * 100 // max(b, 1)}%)  → {target}')
    if count:
        print(f'รวม {count} รูป: {human(total_before)} → {human(total_after)}')
    else:
        print('ไม่มีรูปให้ย่อ', file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
