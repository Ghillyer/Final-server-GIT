const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://ghillyer2:a0SBuaqIdYHr4r0U@cluster1.151dbl8.mongodb.net/';  // Replace this with your actual connection URI

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error: ', err));

module.exports = mongoose;
