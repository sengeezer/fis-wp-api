const Joi = require('joi');
const Boom = require('@hapi/boom');
const handleError = require('./utils/handleError');

const createOfferRoute = {
  method: 'POST',
  path: '/offers',
  options: {
    auth: false,
    validate: {
      payload: Joi.object({
        name: Joi.string().required().note('Offer name'),
        items: Joi.array().items(Joi.string()).required().note('String array of items contained in offer'),
        price: Joi.number().required().note('Price of offer in cents / pence'),
        expires: Joi.date().greater('now').required().note('Offer expiration date')
      }),
      failAction: handleError
    },
    description: 'Add offer',
    notes: 'Add an offer',
    tags: ['api']
  },
  handler: async (request, h) => {
    let redispath = 'offersList';
    let redisvalue = JSON.stringify(request.payload);
    let { redis } = request.server.app;

    try {
      let count = await redis.lpushAsync(redispath, redisvalue);

      return h.response({ count }).code(201);

    } catch (e) {
      return Boom.badImplementation(e);
    }
  }
};

module.exports = createOfferRoute;
