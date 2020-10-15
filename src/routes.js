module.exports = [
  './routes/offerGet',
  './routes/offerPost',
  './routes/offerDelete'
].map((elem) => require(elem));
