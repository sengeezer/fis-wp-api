require('node-env-file')(`${__dirname}/.env`);

const redis = require('redis');
const createServer = require('./src/server');
const { promisify } = require('util');

const init = async () => {
  const server = await createServer({
    port: process.env.PORT,
    host: process.env.HOST
  });

  const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  });

  redisClient.lpushAsync = promisify(redisClient.lpush).bind(redisClient);
  redisClient.lrangeAsync = promisify(redisClient.lrange).bind(redisClient);
  redisClient.llenAsync = promisify(redisClient.llen).bind(redisClient);
  redisClient.lremAsync = promisify(redisClient.lrem).bind(redisClient);
  redisClient.lsetAsync = promisify(redisClient.lset).bind(redisClient);
  redisClient.lrangeAsync = promisify(redisClient.lrange).bind(redisClient);
  redisClient.lindexAsync = promisify(redisClient.lindex).bind(redisClient);

  redisClient.on('error', err => {
    console.error('Redis error:', err);
  });

  server.app.redis = redisClient;

  await server.start();

  console.log(`Offers API server running at: ${server.info.uri}/offers`);
  console.log(`Offers API server docs running at: ${server.info.uri}`);
};

process.on('unhandledRejection', err => {
  console.log(err);

  process.exit(1);
});

init();
