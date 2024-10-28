module.exports = [
  `CREATE TABLE IF NOT EXISTS entries (
    uid               VARCHAR(36) NOT NULL PRIMARY KEY,
    first_name        TEXT NOT NULL,
    last_name         TEXT NOT NULL,
    title             TEXT DEFAULT NULL,
    section           TEXT NOT NULL,
    site_map          INTEGER NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  `CREATE TABLE IF NOT EXISTS items (
    entry_uid         VARCHAR(36) NOT NULL,
    id                TEXT NOT NULL,
    title             TEXT DEFAULT null,
    medium            TEXT DEFAULT null,
    value             BIGINT NOT NULL,
    nfs               BOOLEAN DEFAULT false,
    dimensions        TEXT DEFAULT NULL,
    editions          BIGINT NOT NULL,
    CONSTRAINT fk_item_entry
      FOREIGN KEY (entry_uid) REFERENCES entries (uid)
      ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  
  `CREATE TABLE IF NOT EXISTS ips (
    ip                TEXT NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8`,
];
