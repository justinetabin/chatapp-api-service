const { UsersMongoStore } = require('../services');
const uuid = require('uuid');

module.exports = class UsersWorker {

  /**
   * 
   * @param {UsersMongoStore} usersStore 
   */
  constructor(usersStore) {
    this.usersStore = usersStore;
  }

  async login({ username, password }) {
    return await this.usersStore.login(username, password);
  }

  async signup({ username, password }) {
    return await this.usersStore.signup(username, password)
  }

  async getUser(userId) {
    return await this.usersStore.getUser(userId)
  }
}