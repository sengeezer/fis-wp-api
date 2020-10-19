const Joi = require('joi');
const Boom = require('@hapi/boom');

// Credit: https://medium.com/@piotrkarpaa/handling-joi-validation-errors-in-hapi-17-26fc07448576
const handleError = function (request, h, err) {
  if (err.isJoi && Array.isArray(err.details) && err.details.length > 0) {
      const invalidItem = err.details[0];
      return h.response(`Data Validation Error. Schema violation. <${invalidItem.path}> \nDetails: ${JSON.stringify(err.details)}`)
          .code(400)
          .takeover();
  }

  return h.response(err).takeover();
};

const getOfferRoute = {
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

module.exports = getOfferRoute;
