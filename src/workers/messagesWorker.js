const { MongoDB } = require('../services');
const uuid = require('uuid');
const events = require('events');

module.exports = class MessagesWorker {

  /**
   * 
   * @param {MongoDB} mongodb 
   */
  constructor(mongodb) {
    this.mongodb = mongodb;
    this.collectionName = 'messages';
    this.eventEmitter = new events.EventEmitter();
  }

  onCreateMessage(completionHandler) {
    this.eventEmitter.on('createMessage', completionHandler);
  }

  emitCreateMessage(data) {
    this.eventEmitter.emit('createMessage', data);
  }

  async createMessage({ message, senderId, localId }) {
    const _id = uuid.v4();
    const messageCreated = await this.mongodb.insertOne(this.collectionName, {
      _id,
      localId,
      message,
      senderId,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    const gotMessage = await this.getMessage(_id);
    this.emitCreateMessage(gotMessage);
    return gotMessage;
  }

  async fetchMessages(skip, limit) {
    const messages = await this.mongodb.aggregate(this.collectionName, [
      {$sort: {
        createdAt: -1
      }},
      {$skip: skip},
      {$limit: limit},
      {$lookup: {
        from: 'users',
        localField: 'senderId',
        foreignField: '_id',
        as: 'sender'
      }},
      {$unwind: {
        path: '$sender',
        preserveNullAndEmptyArrays: true
      }},
      {$sort: {
        createdAt: 1
      }},
    ]);
    return messages
  }

  async getMessage(_id) {
    const messages = await this.mongodb.aggregate(this.collectionName, [
      {$match: { _id }},
      {$lookup: {
        from: 'users',
        localField: 'senderId',
        foreignField: '_id',
        as: 'sender'
      }},
      {$unwind: {
        path: '$sender',
        preserveNullAndEmptyArrays: true
      }}
    ])
    if (messages[0] != null) {
      return messages[0]
    } else {
      throw 'Message not found.'
    }
  }
}