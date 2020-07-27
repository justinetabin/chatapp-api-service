const { MongoDB, Hapi } = require('../services');
const UsersWorker = require('./usersWorker');
const MessagesWorker = require('./messagesWorker');

module.exports = class DependencyWorker {

  constructor() {
    this.mongodb = new MongoDB();
    this.hapi = new Hapi(this);
  }

  async startServices() {
    await this.mongodb.connect();
    console.log('MongoDB is connected.');
    
    await this.hapi.startServer();
    console.log('HapiJS is running.');
  }

  makeUsersWorker() {
    return new UsersWorker(this.mongodb);
  }

  makeMessagesWorker() {
    return new MessagesWorker(this.mongodb);
  }
}