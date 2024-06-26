const express = require('express');
const { body } = require('express-validator');
const deckController = require('../controllers/deckController')
const Deck = require('../models/Deck'); // Import the Deck model
const router = express.Router();
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/authenticateToken');
const db = require('../db');


router.post('/signup/pokemon',authenticateToken, deckController.addCards)
router.get('/home',authenticateToken,(req,res)=>{
    return res.json({
        Status: "Success",
        userId: req.userId
})
})
router.get('/deck', authenticateToken,async ( req,res)=>{
    try {
    const userId = req.userId;
    const deck = await Deck.getDeckByUserId(userId);
    if ( deck) {
      if (deck.length < 4) {
        deck.forEach(e => {
          Deck.chooseForBattle(e.card_api, userId, (err, result) => {
            if (err) {
              console.error('Error choosing for battle:', err);
            } else {
              console.log(result);
            }
          });
        });
      }
        return res.json({
          Status: "Success",
          deckData: deck // Include deck data
        });
      } else {
        return res.status(404).json({ error: "User or deck not found" });
      }
    } catch (err) {
      console.error('Error fetching user and deck information:', err);
      return res.status(500).json({ error: "An error occurred" });
    }

})

router.get(`/api/filter`,authenticateToken, (req, res) => {
  const searchTerm = req.query.q;
  const id = parseInt(req.query.userId)
  const filterField = req.query.field;
  if (!searchTerm || !filterField) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const query = `SELECT * FROM users WHERE ${filterField} = ? and id != ?`;
  
  db.query(query, [searchTerm,id ], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json(results);
  });
});
module.exports = router;