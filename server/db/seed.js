// SQL Statements to seed database

module.exports = [

  `CREATE TABLE IF NOT EXISTS entries (
    uid               varchar(36) NOT NULL PRIMARY KEY,
    first_name        text NOT NULL,
    last_name         text NOT NULL,
    title             text DEFAULT NULL,
    section           text NOT NULL,
    site_map          integer NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  `CREATE TABLE IF NOT EXISTS items (
    entry_uid         varchar(36) NOT NULL,
    id                text NOT NULL,
    title             text DEFAULT null,
    medium            text NOT null,
    additional_medium text DEFAULT null,
    value             bigint NOT NULL,
    nfs               boolean DEFAULT false,
    dimensions        text DEFAULT NULL,
    CONSTRAINT fk_item_entry
      FOREIGN KEY (entry_uid) REFERENCES entries (uid)
      ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS ips (
    ip                text NOT NULL,
    created           datetime NOT NULL DEFAULT NOW()
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8`
  
];