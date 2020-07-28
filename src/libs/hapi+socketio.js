const config = require('../config');
const { Server } = require('@hapi/hapi');
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
      this.server.route(routes.map(this.toHapiRoute));
    });

    apiFactory.makeSockets().forEach((socketWrapper) => {
      const nsp = this.io.of(socketWrapper.path)
        nsp.on('connection', (socket) => {

          // when connected, notify wrapper
          socketWrapper.handler(nsp, socket);

          // listen events per socket
          socketWrapper.events.forEach((event) => {
            socket.on(event.name, event.handler);
          });
        });
    });
  }

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