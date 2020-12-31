const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const { userSchema } = require('../models/user');

const docSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
    },
    content: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    editors: [userSchema],
    public: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Doc = mongoose.model('Doc', docSchema);

function validate(doc) {
  const schema = {
    title: Joi.string().min(3).max(100).required().label('Title'),
  };

  const docSchema = Joi.object(schema);

  return docSchema.validate(doc, { abortEarly: false });
}

exports.Doc = Doc;
exports.validate = validate;
