const { MongoConnection, MongoCollection, Hapi, UsersMongoStore, MessagesMongoStore } = require('./services');
const { MessagesWorker, UsersWorker } = require('./workers');
const { Routes, Sockets } = require('./interfaces');

module.exports = class DependencyContainer {

  constructor() {
    this.mongoConn = new MongoConnection();
    this.usersStore = new UsersMongoStore(new MongoCollection(this.mongoConn, 'users'));
    this.messagesStore = new MessagesMongoStore(new MongoCollection(this.mongoConn, 'messages'));

    this.hapi = new Hapi(this);
  }

  async startServices() {
    await this.mongoConn.connect();
    console.log('MongoDB is connected.');
    
    await this.hapi.startServer();
    console.log('HapiJS is running.');
  }

  /**
   * API Factory
   */
  makeRoutes() {
    return Routes(this);
  }

  makeSockets() {
    return Sockets(this);
  }

  /**
   * Worker Factory
   */
  makeUsersWorker() {
    return new UsersWorker(this.usersStore);
  }

  makeMessagesWorker() {
    return new MessagesWorker(this.messagesStore);
  }
}