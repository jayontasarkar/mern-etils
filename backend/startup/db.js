const mongoose = require('mongoose');

module.exports = function () {
  const db = process.env.DB_CONNECTION;
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => console.log('Connected to ' + db))
    .catch((error) => console.error(error.message, error));
};