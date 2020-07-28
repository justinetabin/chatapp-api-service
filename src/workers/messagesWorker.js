const { MessagesMongoStore } = require('../services');
const events = require('events');

module.exports = class MessagesWorker {

  /**
   * 
   * @param {MessagesMongoStore} messagesStore 
   */
  constructor(messagesStore) {
    this.messagesStore = messagesStore;
    this.eventEmitter = new events.EventEmitter();
  }

  onCreateMessage(completionHandler) {
    this.eventEmitter.on('createMessage', completionHandler);
  }

  emitCreateMessage(data) {
    this.eventEmitter.emit('createMessage', data);
  }

  async createMessage({ message, senderId, localId }) {
    const gotMessage = await this.messagesStore.createMessage(message, senderId, localId)
    this.emitCreateMessage(gotMessage);
    return gotMessage;
  }

  async fetchMessages(skip, limit) {
    return await this.messagesStore.fetchMessages(skip, limit);
  }

  getMessage(_id) {
    return this.getMessage(_id);
  }
}