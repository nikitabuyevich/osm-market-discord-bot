const deleteAllMessages = async (channel) => {
  await channel.bulkDelete(100);
  const messages = await channel.fetchMessages({ limit: 1 });
  if (messages.size > 0) {
    await deleteAllMessages(channel);
  }
};

module.exports.deleteAllMessages = deleteAllMessages;
