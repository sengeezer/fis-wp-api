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
      // This function is presently misnamed. Its intended use is to find
      // an item ID that is not identical to its Redis list item ID.

      let getListIndex = async () => {
        let range = await redis.lrangeAsync(redispath, 0, -1);
        
        for (let i = 0; i < range.length; i++) {
          if (i == offerId) {
            return range[i];
          }
        }
      };

      let value = await getListIndex();

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
