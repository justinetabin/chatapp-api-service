const { MongoDB, Hapi } = require('./services');
const { MessagesWorker, UsersWorker } = require('./workers');
const { Routes } = require('./interfaces');

module.exports = class DependencyContainer {

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

  /**
   * API Factory
   */
  makeRoutes() {
    return Routes(this)
  }

  /**
   * Worker Factory
   */

  makeUsersWorker() {
    return new UsersWorker(this.mongodb);
  }

  makeMessagesWorker() {
    return new MessagesWorker(this.mongodb);
  }
}