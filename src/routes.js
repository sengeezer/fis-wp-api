module.exports = [
  './routes/offersGet',
  './routes/offerPost',
  './routes/offerDelete'
].map((elem) => require(elem));
