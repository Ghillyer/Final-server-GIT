const express = require('express');
const multer = require('multer');
const Card = require('../models/Card');
const User = require('../models/User');
const requireAuth = require('../middleware/requireAuth');
const router = express.Router();


const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/list', requireAuth, upload.single('image'), async (req, res) => {
  let imgData = '';
  if (req.file) {
    imgData = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
  }

  const newCard = new Card({
    title: req.body.title,
    playerName: req.body.playerName,
    description: req.body.description,
    price: req.body.price,
    condition: req.body.condition,
    isGraded: req.body.isGraded,
    image: imgData,
    listedBy: req.user._id 
  });

  try {
    await newCard.save();
    res.status(201).json(newCard);
  } catch (error) {
    console.error('Failed to create card:', error);
    res.status(500).json({ error: 'Failed to upload the card' });
  }
});


router.get('/', async (req, res) => {
  try {
    const cards = await Card.find({}).populate('listedBy', 'username');
    res.json(cards);
  } catch (error) {
    console.error("Error fetching cards:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post('/purchase/:cardId', requireAuth, async (req, res) => {
  const cardId = req.params.cardId;
  const userId = req.user._id;

  try {
    const card = await Card.findById(cardId);
    if (card.boughtBy) {
      return res.status(400).json({ message: 'Card already purchased' });
    }

    card.boughtBy = userId;
    await card.save();
    await User.findByIdAndUpdate(userId, { $push: { purchases: card._id } });

    res.json({ message: 'Card purchased successfully', card });
  } catch (error) {
    console.error('Purchase failed:', error);
    res.status(500).json({ error: 'Failed to complete purchase' });
  }
});



module.exports = router;
