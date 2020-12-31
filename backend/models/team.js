const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const { userSchema } = require('../models/user');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 100,
  },
  maxSize: {
    type: Number,
    required: true,
    default: 1,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  members: [userSchema],
});

const Team = mongoose.model('Team', teamSchema);

function validate(team) {
  const schema = {
    name: Joi.string().min(3).max(100).required().label('Team Name'),
    slug: Joi.string().min(3).max(100).required().label('Team ID'),
    maxSize: Joi.number().min(1).max(10).required().label('Team Size'),
  };

  const teamSchema = Joi.object(schema);

  return teamSchema.validate(team, { abortEarly: false });
}

exports.Team = Team;
exports.validate = validate;
