const { MongoDB } = require('../services');
const uuid = require('uuid');

module.exports = class UsersWorker {

  /**
   * 
   * @param {MongoDB} mongodb 
   */
  constructor(mongodb) {
    this.mongodb = mongodb;
    this.collectionName = 'users';
  }

  async signup({ username, password }) {
    const user = await this.mongodb.findOne(this.collectionName, { username });
    if (user != null) {
      throw 'Username exists'
    } else {
      const userToCreate = await this.mongodb.insertOne(this.collectionName, {
        _id: uuid.v4(),
        username,
        password, // hash this
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return userToCreate.ops[0];
    }
  }

  async login({ username, password }) {
    const user = await this.mongodb.findOne(this.collectionName, { username, password });
    if (user != null) {
      return user;
    } else {
      throw 'Username/password is incorrect'
    }
  }

  async getUser(userId) {
    const user = await this.mongodb.findOne(this.collectionName, { _id: userId });
    if (user != null) {
      return user;
    } else {
      throw 'User not found';
    }
  }

  async createMessage({ message, senderId }) {
    const messageCreated = await this.mongodb.insertOne(this.collectionName, {
      _id: uuid.v4(),
      message,
      senderId,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return messageCreated.ops[0];
  }

  async fetchMessages() {
    const messages = await this.mongodb.aggregate(this.collectionName, [
      {$lookup: {
        from: 'users',
        localField: ''
      }}
    ]);
  }
}