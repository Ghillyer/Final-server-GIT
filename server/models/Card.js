const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  title: String,
  playerName: String,
  description: String,
  price: Number,
  condition: String,
  isGraded: String,
  image: String,
  listedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  
  boughtBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }  
});

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
