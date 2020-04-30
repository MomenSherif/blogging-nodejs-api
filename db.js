const mongoose = require('mongoose');

const { mongoDBUrl } = require('./config');

mongoose
  .connect(mongoDBUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected To mongoose successfully!✨✨✨'))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
