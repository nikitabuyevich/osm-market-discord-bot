module.exports.updateMarketPostsEvery = '*/5 * * * *';
module.exports.verifyBuyingChannelEvery = '*/10 * * * *';
module.exports.updateDiscordCharacterDetailsEvery = '*/30 * * * *';
module.exports.checkForStreamersEvery = '*/5 * * * *';

module.exports.momentDateFormat = 'YYYY-MM-DD HH:mm:ss';

module.exports.twitch = {
  gameTag: '[osm]',
  featuredStreamers: ['endernax'],
};

module.exports.incidents = {
  type: {
    BAN: 'ban',
    KICK: 'kick',
    MUTE: 'mute',
  },
};

module.exports.baseAPIUrl = 'https://oldschoolmaple.com/api/v1';
