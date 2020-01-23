const pool = require('../../database');

module.exports = async (member) => {
  try {
    await pool(async (conn) => {
      const [isMuted] = await conn.query('SELECT * FROM incidents WHERE affected_user = ? ORDER BY created DESC LIMIT 1', [member.id]);
      if (isMuted) {
        const mutedRole = member.guild.roles.find(item => item.name === 'Muted');
        await member.addRole(mutedRole.id);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

