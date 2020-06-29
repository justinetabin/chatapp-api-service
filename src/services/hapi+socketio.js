const config = require('../config');
const { Server } = require('@hapi/hapi');
const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const { listen } = require('socket.io');

module.exports = class Hapi {

  constructor(workerFactory) {
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

    // >>>>> TODO: move to outer layer
    const usersWorker = workerFactory.createUsersWorker();
    const messagesWorker = workerFactory.createMessagesWorker();

    messagesWorker.onCreateMessage((data) => {
      this.io.emit('message', data);
    });

    this.io.on('connection', (socket) => {
      console.log('a user connected in /');

      socket.on('disconnect', () => {
        console.log('a user disconnected in /');
      });
    });

    this.server.route([
      {
        method: 'POST',
        path: '/api/users/signup',
        options: {
          tags: ['api'],
          validate: {
            payload: Joi.object({
              username: Joi.string().required(),
              password: Joi.string().required()
            })
          }
        },
        handler: async (request, h) => {
          const payload = request.payload;
          const username = payload.username;
          const password = payload.password;
          try {
            return await usersWorker.signup({ username, password });
          } catch (error) {
            return Boom.unauthorized(error);
          }
        }
      },
      {
        method: 'POST',
        path: '/api/users/login',
        options: {
          tags: ['api'],
          validate: {
            payload: Joi.object({
              username: Joi.string().required(),
              password: Joi.string().required()
            })
          }
        },
        handler: async (request, h) => {
          const payload = request.payload;
          const username = payload.username;
          const password = payload.password;
          try {
            return await usersWorker.login({ username, password });
          } catch (error) {
            return Boom.unauthorized(error);
          }
        }
      },
      {
        method: 'GET',
        path: '/api/users/{id}',
        options: {
          tags: ['api'],
          validate: {
            params: Joi.object({
              id: Joi.string()
            })
          }
        },
        handler: async (request, h) => {
          const payload = request.params;
          const userId = payload.id;
          try {
            return await usersWorker.getUser(userId);
          } catch (error) {
            return Boom.unauthorized(error);
          }
        }
      },
      {
        method: 'POST',
        path: '/api/messages',
        options: {
          tags: ['api'],
          validate: {
            payload: Joi.object({
              message: Joi.string().required(),
              senderId: Joi.string().required(),
              localId: Joi.string().required()
            })
          }
        },
        handler: async (request, h) => {
          const payload = request.payload;
          const message = payload.message;
          const senderId = payload.senderId;
          const localId = payload.localId;
          try {
            await usersWorker.getUser(senderId);
            return await messagesWorker.createMessage({ message, senderId, localId });
          } catch (error) {
            return Boom.badRequest(error);
          }
        }
      },
      {
        method: 'GET',
        path: '/api/messages',
        options: {
          tags: ['api'],
          validate: {
            query: Joi.object({
              skip: Joi.number().default(0),
              limit: Joi.number().default(10)
            })
          }
        },
        handler: async (request, h) => {
          const payload = request.query;
          const skip = payload.skip;
          const limit = payload.limit;
          try {
            return await messagesWorker.fetchMessages(skip, limit);
          } catch (error) {
            return Boom.unauthorized(error);
          }
        }
      }
    ]);
  }
  // <<<<< TODO: move to outer layer

  async startServer() {
    await this.server.register(this.plugins);
    await this.server.start();
  }
}