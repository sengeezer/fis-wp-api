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
        plugin: require('lout'),
        options: {
          endpoint: '/docs'
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

    /**
    server.route({
      method: 'GET',
      path: '/',
      handler: (request, h) => {
          return 'Hello World!';
      }
    });

    server.route({
      method: 'GET',
      path: '/offers',
      handler: (request, h) => {
          return 'Offers API';
      }
    });

    server.route({
      path: '/offers/{id}',
      method: 'GET',
      handler: (request, h) => {
        return `Offer ID: ${encodeURIComponent(request.params.id)}`;
      }
    });
    */
    
    // await server.start();

    // console.log('Server running on %s', server.info.uri);

    return server;
};

module.exports = init;
