const mongoose = require('mongoose');

function isValidId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).send('Invalid ID found.');
  }
  next();
}

module.exports = isValidId;
