const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  password: {
    type: String,
  },
});

userSchema.methods.generateAuthToken = function (team = '') {
  const privateKey = process.env.jWT_PRIVATE_KEY || 'vidly_jwtPrivateKey';
  const token = jwt.sign(
    { _id: this._id, name: this.name, email: this.email, team },
    privateKey
  );
  return token;
};

const User = mongoose.model('User', userSchema);

function validate(user) {
  const schema = {
    email: Joi.string().email().min(1).max(255).required().label('Email'),
    password: Joi.string().min(5).max(1024).required().label('Password'),
  };

  if (user.hasOwnProperty('name'))
    schema.name = Joi.string().min(5).max(100).required().label('Name');

  const userSchema = Joi.object(schema);

  return userSchema.validate(user, { abortEarly: false });
}

exports.userSchema = userSchema;
exports.User = User;
exports.validate = validate;
