const Joi = require('joi');
const Boom = require('@hapi/boom');
const handleError = require('./utils/handleError');

const getOfferRoute = {
  method: 'GET',
  path: '/offers/{id}',
  options: {
    auth: false,
    validate: {
      params: Joi.object({
        id: Joi.string().required().note('ID of item to retrieve from list')
      }),
      failAction: handleError
    },
    description: 'Get offer',
    notes: 'Get an offer from the list',
    tags: ['api']
  },
  handler: async (request, h) => {
    let offerId = encodeURIComponent(request.params.id);
    let redispath = 'offersList';
    let { redis } = request.server.app;

    try {
      let listIndex = await redis.lposAsync(redispath, offerId);
      let value = await redis.lindexAsync(redispath, Number(listIndex));

      if (!value) {
        value = '';
      }

      return h.response({ value: JSON.parse(value) });
    } catch (e) {
      return Boom.badImplementation(e);
    }
  }
};

module.exports = getOfferRoute;
