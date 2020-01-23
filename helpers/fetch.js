const allMessages = async (channel, before, arr) => new Promise(async (resolve) => {
  const messagesCollection = await channel.fetchMessages({ before, limit: 100 });
  if (messagesCollection) {
    const messages = messagesCollection.array();
    const newArr = arr.concat(messages);
    if (messagesCollection.size > 0) {
      resolve(await allMessages(channel, messagesCollection.last().id, newArr));
    } else {
      resolve(newArr);
    }
  } else {
    return resolve(arr);
  }
});

const mutes = require('./fetch/mutes');

module.exports = {
  mutes,
  allMessages,
};
