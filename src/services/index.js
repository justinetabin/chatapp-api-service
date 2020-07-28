const { MongoConnection, MongoCollection } = require('./mongodb');

module.exports = {
  MongoConnection,
  MongoCollection,
  MessagesMongoStore: require('./messagesMongoStore'),
  UsersMongoStore: require('./usersMongoStore'),
  Hapi: require('./hapi+socketio'),
}