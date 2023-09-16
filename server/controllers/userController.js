const User = require('../models/User');
const jwt = require('jsonwebtoken');

class UserController {
  static async newUser(req, res) {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    User.createUserTableIfNotExists();

    User.checkExistingUser(username, (err, userCount) => {
      if (err) {
        res.status(500).json({ message: 'Internal server error' });
      } else {
        if (userCount > 0) {
          res.status(409).json({ error: 'Username or email already exists' });
        } else {
          User.createUser(email, username, password, (err) => {
            if (err) {
              res.status(500).json({ message: 'Internal server error' });
            } else {
              const token = jwt.sign({ username }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
              res.cookie('token', token);
              res.status(201).json({ message: 'Account created successfully' });
            }
          });
        }
      }
    });
  }

  static async updateAvatar(req, res) {
    const username = req.body.username;
    const avatar_api = req.body.avatar_api;
    console.log(avatar_api , "controlle page")

    User.addAvatar(username, avatar_api, (err, result) => {
      if (err) {
        res.status(500).json({ message: 'Internal server error' });
      } else {
        res.status(201).json({ message: 'Avatar added successfully' });
      }
    });
  }

  static async loginUser(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsernameAndPassword(username, password, (err, result) => {
      if (err) {
        res.status(500).json({ message: 'Internal server error' });
      } else {
        if (result.length > 0) {
          const username = result[0].username;
          const token = jwt.sign({ username }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
          res.cookie('token', token);
          res.status(200).json({ message: 'Successful login' });
        } else {
          res.status(401).json({ error: 'Wrong username or password' });
        }
      }
    });
  }
}

module.exports = UserController;
