const Joi = require('joi');
const Boom = require('@hapi/boom');

const getOfferRoute = {
  method: 'POST',
  path: '/offers',
  options: {
    auth: false,
    validate: {
      payload: {
        item: Joi.string().required().note('Text to store in list')
      },
    },
    description: 'Add offer',
    notes: 'Add an offer',
    tags: ['api'],
  },
  handler: async (request, h) => {
    // let { sub: redispath } = request.auth.credentials;
    let { sub: redispath } = 'offersList';
    let { item: redisvalue } = request.payload;
    let { redis } = request.server.app;

    try {
      let count = await redis.lpushAsync(redispath, redisvalue);

      return h.response({ count }).code(201);

    } catch (e) {
      return Boom.badImplementation(e);
    }
  }
};

module.exports = getOfferRoute;
