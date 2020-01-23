const mysql = require('promise-mysql');
const asyncRedis = require('async-redis');
const config = require('../settings/config');

const mySQL = async (cb) => {
  try {
    const conn = await mysql.createConnection({
      ...config.mySQL,
    });
    try {
      await cb(conn);
      await conn.end();
    } catch (err) {
      await conn.end();
      throw err;
    }
  } catch (err) {
    throw err;
  }
};

const Redis = async (cb) => {
  try {
    const client = asyncRedis.createClient();
    client.auth(config.Redis.password);
    try {
      await cb(client);
      await client.quit();
    } catch (err) {
      await client.quit();
      throw err;
    }
  } catch (err) {
    throw err;
  }
};

module.exports.mySQL = mySQL;
module.exports.Redis = Redis;
