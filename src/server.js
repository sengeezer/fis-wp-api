const Hapi = require('@hapi/hapi');

const init = async (serverOptions, options) => {
    const server = Hapi.server(
      Object.assign({
        port: 3001,
        host: 'localhost',
        routes: {
          cors: {
            origin: ['*'],
          },
        },
      }, serverOptions)
    );

    await server.register([
      require('@hapi/vision'),
      require('@hapi/inert'),
      {
        plugin: require('hapi-ending'),
        options: {
          enabled: true
        }
      },
      {
        plugin: require('@hapi/good'),
        options: {
          ops: { interval: 1000 },
          reporters: {
            consoleReporter: [
              {
                module: '@hapi/good-squeeze',
                name: 'Squeeze',
                args: [{response: '*'}]
              },
              { module: '@hapi/good-console' },
              'stdout'
            ]
          }
        }
      }
    ]);

    server.route(require('./routes'));

    return server;
};

module.exports = init;
