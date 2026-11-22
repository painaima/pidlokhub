-- One row per brand storefront at pidlokhub.com/<slug>.
-- An owner (Access-verified email) can have many brands.
CREATE TABLE brands (
  slug         TEXT PRIMARY KEY,
  owner_email  TEXT NOT NULL,
  name         TEXT NOT NULL,
  template     TEXT NOT NULL DEFAULT 'blank',  -- blank | sample, used until the first draft is saved
  draft        TEXT,                           -- JSON; NULL until the editor saves for the first time
  published    TEXT,                           -- JSON; NULL until first publish
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now')),
  published_at TEXT
);

CREATE INDEX brands_owner ON brands (owner_email, updated_at DESC);
