const pool = require('../database');

module.exports.createNew = async (name, startDate, endDate) => {
  console.log(`Creating new season: ${name}.`);
  try {
    await pool(async (conn) => {
      const newSeason = {
        name,
        start_date: startDate,
        end_date: endDate,
      };
      await conn.query('INSERT INTO mapleunityseasons SET ?', [newSeason]);
    });
  } catch (dbErr) {
    console.log(dbErr);
  }
  console.log(`Done creating season ${name}.`);
};
