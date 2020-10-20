const Joi = require('joi');
const Boom = require('@hapi/boom');
const handleError = require('./utils/handleError');

const updateOfferRoute = {
  method: 'PUT',
  path: '/offers',
  options: {
    auth: false,
    validate: {
      payload: Joi.object({
        index: Joi.number().min(0).required().note('Index to delete'),
        name: Joi.string().required().note('Offer name'),
        items: Joi.array().items(Joi.string()).required().note('String array of items contained in offer'),
        price: Joi.number().required().note('Price of offer in cents / pence'),
        expires: Joi.date().required().note('Offer expiration date')
      }),
      failAction: handleError
    },
    description: 'Update offer',
    notes: 'Update an offer',
    tags: ['api']
  },
  handler: async (request, h) => {
    let redispath = 'offersList';
    let redisvalue = JSON.stringify(request.payload);
    let { index: redisindex } = request.payload;
    let { redis } = request.server.app;

    try {
      let count = await redis.lsetAsync(redispath, redisindex, redisvalue);

      return h.response({ count }).code(201);

    } catch (e) {
      return Boom.badImplementation(e);
    }
  }
};

module.exports = updateOfferRoute;
