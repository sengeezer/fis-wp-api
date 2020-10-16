const Joi = require('joi');
const Boom = require('boom');

const deleteOfferRoute = {
  method: 'DELETE',
  path: '/offers',
  options: {
    validate: {
      payload: {
        index: Joi.number().min(0).required().notes('Index to delete')
      }
    },
    description: 'Delete offer',
    notes: 'Delete an offer',
    tags: ['api']
  },
  handler: async (request, h) => {
    // let { sub: redispath } = request.auth.credentials;
    let { sub: redispath } = 'offersList';
    let { index: redisindex } = request.payload;
    let { redis } = request.server.app;

    try {
      await redis.lsetAsync(redispath, redisindex, '__DELETE__');
      await redis.lremAsync(redispath, 1, '__DELETE__');

      return h.response({}).code(200);
    } catch (e) {
      return Boom.badImplementation(e);
    }
  }
};

module.exports = deleteOfferRoute;