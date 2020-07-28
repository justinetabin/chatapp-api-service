const { MessagesMongoStore } = require('../services');

module.exports = class MessagesWorker {

  /**
   * 
   * @param {MessagesMongoStore} messagesStore 
   */
  constructor(messagesStore) {
    this.messagesStore = messagesStore;
  }

  onCreateMessage(completion) {
    this.messagesStore.onCreateMessage(completion)
  }

  async createMessage({ message, senderId, localId }) {
    const gotMessage = await this.messagesStore.createMessage(message, senderId, localId)
    return gotMessage;
  }

  async fetchMessages(skip, limit) {
    return await this.messagesStore.fetchMessages(skip, limit);
  }

  getMessage(_id) {
    return this.getMessage(_id);
  }
}