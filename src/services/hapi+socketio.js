const config = require('../config');
const { Server } = require('@hapi/hapi');
const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const { listen } = require('socket.io');

module.exports = class Hapi {

  constructor(apiFactory) {
    this.server = Server({
      port: config.HAPI_PORT,
      host: config.HAPI_HOST
    });
    this.io = listen(this.server.listener);

    this.plugins = [
      Inert,
      Vision,
      {
        plugin: HapiSwagger,
        options: {
          info: {
            title: config.SWAGGER_DOC_TITLE,
            version: config.SWAGGER_DOC_VERSION,
          }
        }
      }
    ]

    apiFactory.makeRoutes().forEach((routes) => {
      this.server.route(routes.map(this.toHapiRoute))
    })
  }

    // >>>>> TODO: move to outer layer
  //   const usersWorker = workerFactory.makeUsersWorker();
  //   const messagesWorker = workerFactory.makeMessagesWorker();

  //   messagesWorker.onCreateMessage((data) => {
  //     this.io.emit('message', data);
  //   });

  //   this.io.on('connection', (socket) => {
  //     console.log('a user connected in /');

  //     socket.on('disconnect', () => {
  //       console.log('a user disconnected in /');
  //     });
  //   });
  // <<<<< TODO: move to outer layer

  toHapiRoute(route) {
    return {
      method: route.method,
      path: route.path,
      options: {
        tags: ['api'],
        validate: route.validate
      },
      handler: async (req, h) => {
        return route.handler(req.payload, req.params, req.query, req.headers);
      }
    }
  }

  async startServer() {
    await this.server.register(this.plugins);
    await this.server.start();
  }
}