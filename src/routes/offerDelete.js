const Joi = require('joi');
const Boom = require('@hapi/boom');
const handleError = require('./utils/handleError');

const deleteOfferRoute = {
  method: 'DELETE',
  path: '/offers',
  options: {
    auth: false,
    validate: {
      payload: Joi.object({
        index: Joi.number().min(0).required().note('Index to delete')
      }),
      failAction: handleError
    },
    description: 'Delete offer',
    notes: 'Delete an offer',
    tags: ['api']
  },
  handler: async (request, h) => {
    let redispath = 'offersList';
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
