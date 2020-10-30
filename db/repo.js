const mysql = require('mysql2/promise');
const uuid = require('uuid/v4');
const config = require('../config');

const entryFields = `
  uid,
  first_name AS firstName,
  last_name AS lastName,
  entries.title AS title,
  section AS section,
  site_map AS siteMap
`;

const itemFields = `
  items.medium as medium,
  items.additional_medium as additionalMedium,
  items.title as itemTitle,
  items.id as itemId,
  items.value as value,
  items.nfs as nfs,
  items.dimensions as dimensions
`;

const { url } = config.database;
const db = mysql.createPool(url);

const insertIp = async (ip) => {
  return await db.execute({
    sql: 'INSERT INTO ips SET ip = ?',
    values: [ip],
  });
};

const getIp = async (ip) => {
  const [res] = await db.execute({
    sql: 'SELECT created FROM ips WHERE ip = ?',
    values: [ip],
  });
  if (res && res.length > 0) {
    return res[0];
  }
  return null;
};

const cleanIps = async () => {
  return await db.execute({
    sql: 'DELETE FROM ips WHERE created < DATE_ADD(NOW(), INTERVAL -1 HOUR)',
  });
};

const insertForm = async function ({
  firstName,
  lastName,
  title,
  section,
  siteMap,
  items,
}) {
  const uid = uuid();
  const conn = await db.getConnection();
  try {
    await conn.query('START TRANSACTION');
    await conn.query({
      sql: `INSERT INTO entries SET
              uid = ?,
              first_name = ?,
              last_name = ?,
              section = ?,
              title = ?,
              site_map = ?`,
      values: [uid, firstName, lastName, section, title, siteMap],
    });
    items.forEach(async (item) => {
      await conn.query({
        sql: `INSERT INTO items SET
                entry_uid = ?,
                id = ?,
                title = ?,
                value = ?,
                nfs = ?,
                medium = ?,
                additional_medium = ?,
                dimensions = ?`,
        values: [
          uid,
          item.id,
          item.title,
          item.value,
          item.nfs || false,
          item.medium,
          item.additional_medium,
          item.dimensions,
        ],
      });
    });
    await conn.query('COMMIT');
  } catch (err) {
    await conn.query('ROLLBACK');
    throw new Error(err);
  } finally {
    await conn.release();
  }
  return uid;
};

const getEntries = async () => {
  const [res] = await db.execute({
    sql: `SELECT ${entryFields} FROM entries`,
  });
  return res;
};

const getEntry = async (uid) => {
  const [results] = await db.execute({
    sql: `SELECT ${entryFields}, ${itemFields} 
          FROM entries
          LEFT JOIN items
          ON items.entry_uid = entries.uid
          WHERE entries.uid = ?`,
    values: [uid],
    nestTables: true,
  });

  if (results && results.length > 0) {
    const obj = results[0].entries;
    obj.items = [];
    results.forEach((res) => {
      obj.items.push(res.items);
    });
    return obj;
  }
  return null;
};

module.exports = {
  db,
  insertForm,
  getEntries,
  getEntry,
  cleanIps,
  getIp,
  insertIp,
};
