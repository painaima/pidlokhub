"""Bundle the local prototype and its images into one portable HTML file."""
from pathlib import Path
import base64
import json

source = Path(__file__).resolve().parent
assets = {
    path.stem: 'data:image/jpeg;base64,' + base64.b64encode(path.read_bytes()).decode()
    for path in sorted((source / 'assets').glob('*.jpg'))
}
script = (source / 'app.js').read_text().replace(
    'const image = name => `assets/${name}.jpg`;',
    'const image = name => LOCAL_ASSETS[name];',
)
html = (source / 'index.html').read_text()
favicon = base64.b64encode((source / 'assets/favicon.svg').read_bytes()).decode()
html = html.replace('href="assets/favicon.svg"', f'href="data:image/svg+xml;base64,{favicon}"')
html = html.replace('<link rel="stylesheet" href="styles.css">', '<style>\n' + (source / 'styles.css').read_text() + '\n</style>')
html = html.replace('<script src="app.js"></script>', '<script>\n\'use strict\';\nconst LOCAL_ASSETS=' + json.dumps(assets) + ';\n' + script + '\n</script>')
target = source.parent / 'บ้านก๋ง-prototype.html'
target.write_text(html)
print(f'Built {target.name}: {target.stat().st_size:,} bytes')
