const globals = require('../../../globals');
const pool = require('../../../database');
const util = require('../../util');

const deleteMessages = async (channel, ign, messages, keyToDelete) => {
  const { players } = globals.variables.market.channel[channel.name];
  await pool.Redis(async (client) => {
    await client.del(keyToDelete);
  });
  for await (const playerName of Object.keys(players)) {
    if (playerName === ign) {
      const player = globals.variables.market.channel[channel.name].players[playerName];
      for await (const message of messages) {
        for (let i = 0; i < player.messages.length; i += 1) {
          const playerMessage = player.messages[i];
          if (playerMessage.content === message) {
            players[playerName].messages.splice(i, 1);
            channel.bulkDelete([playerMessage]);
            return;
          }
        }
      }
    }
  }
};

const clearChannel = async (channel, keyToDelete) => {
  globals.variables.market.channel[channel.name].players = {};
  await util.deleteAllMessages(channel);
  await pool.Redis(async (client) => {
    await client.del(keyToDelete);
  });
};

const deleteAllMessages = async (channel, ign, keyToDelete) => {
  const { players } = globals.variables.market.channel[channel.name];
  for await (const playerName of Object.keys(players)) {
    if (playerName === ign) {
      const player = globals.variables.market.channel[channel.name].players[playerName];
      delete globals.variables.market.channel[channel.name].players[playerName];
      await channel.bulkDelete(player.messages);
    }
  }
  await pool.Redis(async (client) => {
    await client.del(keyToDelete);
  });
};

module.exports = async (bot) => {
  const channel = bot.channels.find(item => item.name === 'listings');
  try {
    await pool.Redis(async (client) => {
      const redisKeys = await client.keys('*');
      for await (const key of redisKeys) {
        const redisKeyMarketListingClearAll = 'market-listing-clear-all';
        const redisKeyMarketListing = 'market-listing-';
        const redisKeyMarketItemListing = 'market-item-listing-';
        if (key.startsWith(redisKeyMarketListingClearAll)) {
          await clearChannel(channel, key);
        } else if (key.startsWith(redisKeyMarketListing)) {
          const ign = key.substr(redisKeyMarketListing.length);
          await deleteAllMessages(channel, ign, key);
        } else if (key.startsWith(redisKeyMarketItemListing)) {
          const ign = key.substr(redisKeyMarketItemListing.length);
          const messages = await client.lrange(key, 0, -1);
          await deleteMessages(channel, ign, messages, key);
        }
      }
    });
  } catch (err) {
    return console.log(err);
  }
};
