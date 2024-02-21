const Battle = require("../models/Battle");
const jwt = require("jsonwebtoken");

class battleController {
  static async newBattle(req, res) {
    try {
      const userF = req.body.userF;
      const userS = req.body.userS;

      await Battle.createBattle(userF, userS);
      res.status(201).json({ message: "Battle created successfully" });
    } catch (err) {
      console.error('Error while creating battle:', err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
 
  static async battleEnding(req, res) {
    const battleId = req.body.battleId;
    console.log("end battle id :", battleId);

    Battle.endBattle(battleId)
      .then(() => {
        res.status(200).json({ message: "Battle ended successfully" });
      })
      .catch((err) => {
        console.error("Error ending battle:", err);
        res.status(500).json({ message: "Internal server error" });
      });
  }
  static async getInProgress(req, res) {
    const userId = req.body.userId;
    console.log(userId);

    Battle.getInProgress(userId, (err) => {
      if (err) {
        res.status(500).json({ message: "Internal server error" });
      } else {
        res
          .status(201)
          .json({ message: "In progress battles sent successfully" });
      }
    });
  }
}

module.exports = battleController;
