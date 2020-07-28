const { MongoCollection } = require('./mongodb');
const uuid = require('uuid');
const events = require('events');

module.exports = class MessagesMongoStore {
    
    /**
    * 
    * @param {MongoCollection} collection 
    */
    constructor(collection) {
        this.collection = collection
        this.eventEmitter = new events.EventEmitter();
    }

    onCreateMessage(completion) {
        this.eventEmitter.on('createMessage', completion);
    }

    emitCreateMessage(data) {
        this.eventEmitter.emit('createMessage', data);
    }
    
    async createMessage(message, senderId, localId) {
        const _id = uuid.v4();
        const messageCreated = await this.collection.insertOne({
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
        const messages = await this.collection.aggregate([
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
        const messages = await this.collection.aggregate([
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