const uuid = require('uuid');

module.exports = class UsersMongoStore {
    
    constructor(collection) {
        this.collection = collection;
    }
    
    async login(username, password) {
        const user = await this.collection.findOne({ username, password });
        if (user != null) {
            return user;
        } else {
            throw 'Username/password is incorrect'
        }
    }
    
    async signup(username, password) {
        const user = await this.collection.findOne({ username });
        if (user != null) {
            throw 'Username exists'
        } else {
            const userToCreate = await this.collection.insertOne({
                _id: uuid.v4(),
                username,
                password, // TODO: hash this and create a separate collection
                createdAt: new Date(),
                updatedAt: new Date()
            });
            return userToCreate.ops[0];
        }
    }
    
    async getUser(userId) {
        const user = await this.collection.findOne({ _id: userId });
        if (user != null) {
            return user;
        } else {
            throw 'User not found';
        }
    }

    async getUserByUsername(username) {
        const user = await this.collection.findOne({ username });
        if (user != null) {
            return user;
        } else {
            throw 'User not found';
        }
    }
}
