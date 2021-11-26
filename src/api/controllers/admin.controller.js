const db = require("../models");
const config = require("../../config/auth.config.js");
var generator = require('generate-password');
const constValues = require("../helpers/constant")

const User = db.user;

var bcrypt = require("bcryptjs");

var password = generator.generate({
	length: 10,
	numbers: true
});

exports.createInstructor = (req, res) => {
  User.create({
    username: req.body.username,
    password: bcrypt.hashSync(password, 8),
    userType: constValues.userRoles.INSTRUCTOR
  })
    .then(user => {
        user.save().then(() => {
            res.status(200).send({ 
                username: req.body.username,
                password: password,
                message: `${req.body.username} was registered successfully!`
            });
        });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};
