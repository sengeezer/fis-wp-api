const Joi = require('joi');
const Boom = require('@hapi/boom');

const getOfferRoute = {
  method: 'GET',
  path: '/offers',
  options: {
    auth: false,
    validate: {
      query: Joi.object({
        start: Joi.number().min(0).default(0).note('Start index of results inclusive'),
        results: Joi.number().min(1).max(100).default(10).note('Number of results to return')
      })
    },
    description: 'Get offers',
    notes: 'Get offers list in a paged format',
    tags: ['api']
  },
  handler: async (request, h) => {
    // let { sub: redispath } = request.auth.credentials;
    let redispath = 'offersList';
    let { redis } = request.server.app;
    let { start, results } = request.query;

    try {
      let value = await redis.lrangeAsync(redispath, start, start + (results - 1));
      let count = await redis.llenAsync(redispath);

      if (!value) {
        value = [];
      }

      return h.response({
        nextlink: `${request.url.pathname}?start=${start + results}&results=${results}`,
        value,
        count
      });
    } catch (e) {
      return Boom.badImplementation(e);
    }
  }
};

module.exports = getOfferRoute;
