// Database interactions
const mysql = require("mysql2/promise");
const uuid = require("uuid/v4");
const config = require("../config");

const entryFields = `
  uid,
  first_name AS firstName,
  last_name AS lastName,
  title AS title,
  section AS section,
  site_map AS siteMap
`;

// Start database connection

const { url, } = config.database;
console.log("Establishing database connection");

/**
 * Raw SQL connection pool object
*/
const db = mysql.createPool(url);

/**
 * Inserts a new ArtSite form into the database. Returns its unique ID. 
*/
const insertForm = async function({ firstName, lastName, title, section, siteMap, items }) {
  const uid = uuid();
  const conn = await db.getConnection();
  try {
    await conn.query("START TRANSACTION");
    await conn.query({
      sql: `INSERT INTO entries SET
              uid = ?,
              first_name = ?,
              last_name = ?,
              section = ?,
              title = ?,
              site_map = ?`,
      values: [uid, firstName, lastName, section, title, siteMap,],
    });
    items.forEach(async(item) => {
      await conn.query({
        sql: `INSERT INTO items SET
                entry_uid = ?,
                title = ?,
                value = ?,
                medium = ?`,
        values: [uid, item.title, item.value, item.medium],
      });
    });
    await conn.query("COMMIT");
  } catch(error) {
    await conn.query("ROLLBACK");
    throw error;
  } finally {
    await conn.release();
  }
  return uid;
}

const getEntries = async function() {
  const [res] = await db.execute({
    sql: `SELECT ${entryFields} FROM entries`
  });
  return res;
}

module.exports = {
  db,
  insertForm,
  getEntries,
};