const mongodb = require('mongodb');
const config = require('../config');

exports.MongoConnection = class MongoConnection {

  async connect() {
    this.client = await mongodb.MongoClient.connect(config.MONGODB_URI, { useUnifiedTopology: true });
    this.db = this.client.db(config.MONGODB_DB_NAME);
  }
}

exports.MongoCollection = class MongoCollection {

  constructor(mongoConnection, collectionName) {
    this.conn = mongoConnection;
    this.collectionName = collectionName;
  }

  async insertOne(payload) {
    return await this.conn.db.collection(this.collectionName).insertOne(payload);
  }

  async find(query) {
    return await this.conn.db.collection(this.collectionName).find(query).toArray();
  }

  async findOne(query) {
    return await this.conn.db.collection(this.collectionName).findOne(query);
  }

  async aggregate(pipeline) {
    return await this.conn.db.collection(this.collectionName).aggregate(pipeline).toArray();
  }
}