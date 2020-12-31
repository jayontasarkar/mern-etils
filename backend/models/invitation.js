const mongoose = require('mongoose');
const crypto = require('crypto');
const Joi = require('@hapi/joi');

const invitationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
    },
    token: {
      type: String,
      unique: true,
      minlength: 100,
      maxlength: 365,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
    },
  },
  { timestamps: true }
);

// Hooks
invitationSchema.pre('save', async function (next) {
  try {
    var current_date = new Date().valueOf().toString();
    var random = Math.random().toString();
    this.token = await crypto
      .createHash('sha1')
      .update(current_date + random)
      .digest('hex');
    return next();
  } catch (error) {
    return next(error);
  }
});

const Invitation = mongoose.model('Invitation', invitationSchema);

function validate(invitation) {
  const schema = {
    email: Joi.string().email().min(3).max(255).required().label('Email'),
  };

  const invitationSchema = Joi.object(schema);

  return invitationSchema.validate(invitation, { abortEarly: false });
}

exports.Invitation = Invitation;
exports.validate = validate;
