const Joi = require('joi');
const Boom = require('@hapi/boom');
const handleError = require('./utils/handleError');

const getOfferRoute = {
  method: 'GET',
  path: '/offers/{id}',
  options: {
    auth: false,
    validate: {
      payload: Joi.object({
        itemId: Joi.string().required().note('ID of item to retrieve from list')
      }),
      failAction: handleError
    },
    description: 'Get offer',
    notes: 'Get an offer from the list',
    tags: ['api']
  },
  handler: async (request, h) => {
    let offerId = encodeURIComponent(request.params.id);
    // let redispath = 'offersList';
    let { redis } = request.server.app;
    // let { start, results } = request.query;

    try {
      let listIndex = await redis.lposAsync(offerId);
      let value = await redis.lindexAsync(listIndex);

      if (!value) {
        value = '';
      }

      return h.response({ value });
    } catch (e) {
      return Boom.badImplementation(e);
    }
  }
};

module.exports = getOfferRoute;
