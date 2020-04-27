const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

const { mongoDBUrl } = require('./config');

mongoose.plugin(slug);

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
