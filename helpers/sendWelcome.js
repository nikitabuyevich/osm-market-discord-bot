const { discordBot } = require('../settings/config');

module.exports = (member, bot) => {
  const welcomeMessage = `Welcome to OSM <@!${member.id}>! You can type **!commands** to see what I'm capable of! Feel free to checkout our forums (https://forum.oldschoolmaple.com) to get the latest announcement and updates.\n\n**We strongly advise you to read the the following guides to help you get started on your OSM journey:\n<https://forum.oldschoolmaple.com/threads/welcome-to-osm.591>\n<https://forum.oldschoolmaple.com/threads/a-beginners-guide-to-osm.619>**\n\nYou can also introduce yourself and say hi to everyone: <https://forum.oldschoolmaple.com/forums/introductions-farewells.27>`;
  member.user.send(welcomeMessage);
};
