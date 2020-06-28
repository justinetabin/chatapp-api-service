const mongodb = require('mongodb');
const config = require('../config');

module.exports = class MongoDB {

  async connect() {
    this.client = await mongodb.MongoClient.connect(config.MONGODB_URI, { useUnifiedTopology: true });
    this.db = this.client.db(config.MONGODB_DB_NAME);
  }

  async insertOne(collectionName, payload) {
    return await this.db.collection(collectionName).insertOne(payload);
  }

  async find(collectionName, query) {
    return await this.db.collection(collectionName).find(query).toArray();
  }

  async findOne(collectionName, query) {
    return await this.db.collection(collectionName).findOne(query);
  }

  async aggregate(collectionName, pipeline) {
    return await this.db.collection(collectionName).aggregate(pipeline).toArray();
  }
}