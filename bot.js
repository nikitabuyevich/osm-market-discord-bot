const Discord = require('discord.js');
const schedule = require('node-schedule');
const settings = require('./settings');
const fs = require('mz/fs');
const globals = require('./globals');
const {
  verify, fetch, check, sendWelcome, util,
} = require('./helpers');
const { discordBot: discordBotConfig } = require('./settings/config');

const bot = new Discord.Client();

const readJson = async (filename) => {
  try {
    const file = await fs.readFile(filename);
    return JSON.parse(file.toString());
  } catch (err) {
    console.error(err);
  }
};

const populateAllMessages = async (channel, before) => {
  const messagesCollection = await channel.fetchMessages({ before, limit: 100 });
  if (messagesCollection) {
    const messages = messagesCollection.array();
    for (const message of messages) {
      if (message.author.bot) {
        let ign = message.author.username;
        const hasDiscordIntegration = message.author.username.indexOf(' -') !== -1;
        if (hasDiscordIntegration) {
          ign = message.author.username.substr(0, message.author.username.indexOf(' -'));
        }
        if (!globals.variables.market.channel[channel.name].players[ign]) {
          globals.variables.market.channel[channel.name].players[ign] = {
            messages: [],
          };
        }
        globals.variables.market.channel[channel.name].players[ign].messages.push(message);
      }
    }
    if (messagesCollection.size > 0) {
      await populateAllMessages(channel, messagesCollection.last().id);
    }
  }
};

const getListings = async (channelName) => {
  console.log(`Getting #${channelName} messages...`);
  const channel = bot.channels.find(item => item.name === channelName);
  await populateAllMessages(channel, 0);
  console.log('Done.');
};

const clearListings = async (channelName) => {
  console.log(`Clearing #${channelName} messages...`);
  const channel = bot.channels.find(item => item.name === channelName);
  await util.deleteAllMessages(channel);
  console.log('Done.');
};

const validMessage = (message) => {
  if (message.member.hasPermission('MANAGE_MESSAGES')) {
    return true;
  }

  // eslint-disable-next-line no-param-reassign
  const messageFormatted = message.content.toLowerCase();
  const cantUseTheseWords = [
    'sell',
    'selling',
    'buy',
    'buying',
    'trade',
    'trading',
  ];
  const cantContain = [
    'b>',
    'b<',
    '<b',
    '>b',
    's>',
    's<',
    '<s',
    '>s',
    't>',
    't<',
    '<t',
    '>t',
  ];
  const whitelistedWords = [
    'where',
    'how',
    'when',
  ];
  for (const word of cantContain) {
    if (messageFormatted.indexOf(word) > -1) {
      return false;
    }
  }

  const origianlMessageInWords = messageFormatted.trim().split(/\s+/);
  // People asking questions
  for (const word of whitelistedWords) {
    if (origianlMessageInWords.includes(word)) {
      return true;
    }
  }

  for (const word of cantUseTheseWords) {
    if (origianlMessageInWords.includes(word)) {
      return false;
    }
  }

  return true;
};

const parseSoldData = async () => {
  const channel = bot.channels.find(item => item.name === 'sold');
  try {
    console.log('Fetching sold messages...');
    const soldMessages = await fetch.allMessages(channel, 0, []);
    console.log('Done');
    // const messagesCollection = await channel.fetchMessages({ before: 0, limit: 100 });
    // if (messagesCollection) {
    //   const messages = messagesCollection.array();
    //   const soldData = messages.map(message => ({
    //     message: message.content,
    //     seller: message.author.username,
    //     created: message.createdTimestamp,
    //   }));
    // }
    console.log('Formatting sold data...');
    const soldData = soldMessages.map(message => ({
      message: message.content,
      seller: message.author.username,
      created: message.createdTimestamp,
    }));
    console.log('Done');
    console.log('Writing to file...');
    fs.writeFile('./sold-data.json', JSON.stringify(soldData, null, 2));
    console.log('Done');
  } catch (ex) {
    console.log(ex);
  }
};

bot.on('ready', async () => {
  await parseSoldData();
  // console.log(`${bot.user.username} is online on ${bot.guilds.size} servers!`);
  // await getListings('listings');
  // schedule.scheduleJob(settings.updateMarketPostsEvery, () => {
  //   verify.market.listings(bot);
  // });
  // verify.market.buying(bot);
  // schedule.scheduleJob(settings.verifyBuyingChannelEvery, () => {
  //   verify.market.buying(bot);
  // });
});

// bot.on('message', async (message) => {
//   if (message.author.bot) {
//     if (message.channel.name === 'listings') {
//       let ign = message.author.username;
//       const hasDiscordIntegration = message.author.username.indexOf(' -') !== -1;
//       if (hasDiscordIntegration) {
//         ign = message.author.username.substr(0, message.author.username.indexOf(' -'));
//       }
//       if (!globals.variables.market.channel.listings.players[ign]) {
//         globals.variables.market.channel.listings.players[ign] = {
//           messages: [],
//         };
//       }
//       globals.variables.market.channel.listings.players[ign].messages.push(message);
//     } else if (message.channel.name === 'sold') {
//       let ign = message.author.username;
//       const hasDiscordIntegration = message.author.username.indexOf(' -') !== -1;
//       if (hasDiscordIntegration) {
//         ign = message.author.username.substr(0, message.author.username.indexOf(' -'));
//       }
//       if (!globals.variables.market.channel.sold.players[ign]) {
//         globals.variables.market.channel.sold.players[ign] = {
//           messages: [],
//         };
//       }
//       globals.variables.market.channel.sold.players[ign].messages.push(message);
//     }
//   } else if (!validMessage(message)) {
//     const originalMessage = message.content;
//     message.delete();
//     const embed = new Discord.RichEmbed()
//       .setColor(discordBotConfig.red)
//       .setTimestamp()
//       .setThumbnail('https://i.imgur.com/UXkyX2E.png')
//       .addField('Attempting to Buy/Sell', 'We\'ve detected a keyword that is used to sell or buy items. Please use the integrated tools we offer instead of trying to do it manually through Discord.')
//       .addField('Original Message', originalMessage)
//       .addField('Integrated Tools', 'OSM has integrated multiple tools to help you sell and buy items in-game through modern tools like Discord. Feel free to take advantage of them.')
//       .addField('Selling Items', 'If you open up a shop in the Free Market, your items will be posted to the **#listings** channel in 1-2 hours. Any item that sells, will be posted to **#sold** (This is a great way to price check items).')
//       .addField('Buying Items', 'If you wish to buy items, simply visit the Free Market, press the HELP button in your MapleStory key configs >> "I want to interact with Discord" >> "Send a message to Buying" >> And your message will automatically be posted to **#buying** (The channel is self moderating).');

//     message.author.send(embed);
//   }
// });

// bot.on('messageUpdate', (oldMessage, newMessage) => {
//   if (!newMessage.author.bot && !validMessage(newMessage)) {
//     const originalMessage = newMessage.content;
//     newMessage.delete();
//     const embed = new Discord.RichEmbed()
//       .setColor(discordBotConfig.red)
//       .setTimestamp()
//       .setThumbnail('https://i.imgur.com/UXkyX2E.png')
//       .addField('Attempting to Buy/Sell', 'We\'ve detected a keyword that is used to sell or buy items. Please use the integrated tools we offer instead of trying to do it manually through Discord.')
//       .addField('Original Message', originalMessage)
//       .addField('Integrated Tools', 'OSM has integrated multiple tools to help you sell and buy items in-game through modern tools like Discord. Feel free to take advantage of them.')
//       .addField('Selling Items', 'If you open up a shop in the Free Market, your items will be posted to the **#listings** channel in 1-2 hours. Any item that sells, will be posted to **#sold** (This is a great way to price check items).')
//       .addField('Buying Items', 'If you wish to buy items, simply visit the Free Market, press the HELP button in your MapleStory key configs >> "I want to interact with Discord" >> "Send a message to Buying" >> And your message will automatically be posted to **#buying** (The channel is self moderating).');

//     newMessage.author.send(embed);
//   }
// });

bot.login(discordBotConfig.token);
