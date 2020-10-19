module.exports = [
  // Add offerGet
  // TODO: Add new route to update (PUT) offer
  './routes/offerGet',
  './routes/offersGet',
  './routes/offerPost',
  './routes/offerDelete'
].map((elem) => require(elem));
