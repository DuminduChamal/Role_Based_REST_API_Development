const db = require("../models");
const config = require("../../config/auth.config.js");
const User = db.user;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");


exports.login = (req, res) => {
    User.findOne({
        where: {
        username: req.body.username
        }
    })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found!" });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.userID, userRole: user.userType }, config.secret, {
        expiresIn: 43200 // 12 hours
      });

    
        res.status(200).send({
            accessToken: token
        });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};