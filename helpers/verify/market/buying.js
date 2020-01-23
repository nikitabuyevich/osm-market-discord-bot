const fetch = require('../../../helpers/fetch');

const deleteOlderMessages = async (bot, channelName) => {
  console.log(`Deleting older messages in #${channelName}...`);
  const channel = bot.channels.find(item => item.name === channelName);
  const allMessages = await fetch.allMessages(channel, 0, []);
  const ignsOfPostedMessages = [];
  for (const message of allMessages) {
    if (message.author.bot) {
      const timeInMillisecondsSinceMessageCreated = new Date().getTime() - new Date(message.createdTimestamp).getTime();
      const maxHoursBeforeDeletion = 48;
      const been48Hours = timeInMillisecondsSinceMessageCreated > (1000 * 60 * 60 * maxHoursBeforeDeletion);
      if (been48Hours) {
        message.delete();
      } else {
        let ign = message.author.username;
        const hasDiscordIntegration = message.author.username.indexOf(' -') !== -1;
        if (hasDiscordIntegration) {
          ign = message.author.username.substr(0, message.author.username.indexOf(' -'));
        }
        if (ignsOfPostedMessages.includes(ign)) {
          message.delete();
        } else {
          ignsOfPostedMessages.push(ign);
        }
      }
    }
  }
  console.log('Done.');
};


module.exports = async (bot) => {
  await deleteOlderMessages(bot, 'buying');
};
