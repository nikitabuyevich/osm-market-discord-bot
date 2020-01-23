const {
  maps: { mapleIsland },
} = require('../data');
const sql = require('../helpers/sql');

const lucky7SkillId = 4001344;
const doubleStabSkillId = 4001334;
const savageBlowSkillId = 4201005;

const lv10TwoHandedAxeItemId = 1412001;

module.exports.checkIf = {
  islander: `
      SELECT b.ID as charId
      ${sql.validAccounts}
      AND \`level\` > 10 AND \`map\` IN (${mapleIsland.join()}) 
    `,
  hpWarrior: `
      SELECT b.ID as charId
      ${sql.validAccounts}
      AND \`str\` = 35 AND \`dex\` < 20 AND \`mhp\` > 550 AND \`job\` IN (100, 110, 111)
    `,
  strengthMage: `
      SELECT b.ID as charId
      ${sql.validAccounts}
      AND \`int\` = 20 AND str > 20 AND job IN (200, 210, 211, 220, 221, 230, 231)
    `,
  woodsman: `
      SELECT b.ID as charId
      FROM wvsbeta.characters as b
      INNER JOIN wvsbeta.users as u
      ON b.userid = u.id
      INNER JOIN wvsbeta.inventory_eqp ie
      ON b.ID = ie.charid
      ${sql.validAccountsWhereStatement}
      AND ie.itemid = ${lv10TwoHandedAxeItemId} AND ie.slot < 0 AND \`str\` > 35 AND \`dex\` <= 50 AND \`job\` IN (300, 310, 311, 320, 321)
    `,
  brigand: `
      SELECT b.ID as charId
      FROM wvsbeta.characters as b
      INNER JOIN wvsbeta.users as u
      ON b.userid = u.id
      INNER JOIN wvsbeta.skills as s
      ON b.ID = s.charid
      ${sql.validAccountsWhereStatement}
      AND s.skillid <> ${doubleStabSkillId} AND s.skillid <> ${lucky7SkillId} AND s.skillid <> ${savageBlowSkillId} AND \`str\` > 25 AND \`dex\` <= 50 AND \`luk\` < 10 AND \`job\` IN (400, 420, 421)
      GROUP BY b.ID
    `,
};

module.exports.get = oddJobName => `
    SELECT odd_job_name as name, char_id as charId
    FROM \`mg-website\`.odd_job_types
    WHERE odd_job_name = '${oddJobName}'
  `;

module.exports.delete = charId => `
    DELETE FROM \`mg-website\`.odd_job_types
    WHERE char_id = '${charId}'
  `;

module.exports.add = (oddJobName, charId) => `
      INSERT INTO \`mg-website\`.odd_job_types (odd_job_name, char_id)
      VALUES ('${oddJobName}', ${charId})
    `;

module.exports.addMultiple = (oddJobName, characters) => {
  const charIds = characters.map(character => character.charId);
  const values = charIds.map(charId => `('${oddJobName}', ${charId})`);
  return `
      INSERT INTO \`mg-website\`.odd_job_types (odd_job_name, char_id)
      VALUES ${values}
    `;
};
