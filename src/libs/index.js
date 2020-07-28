const { MongoCollection, MongoConnection } = require('./mongodb');

module.exports = {
    MongoCollection,
    MongoConnection,
    Hapi: require('./hapi+socketio'),
}