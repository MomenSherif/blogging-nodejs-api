const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const uesrSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, 'First Name is required!'],
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, 'Last Name is required!'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: [true, 'Email is required!'],
    },
    password: {
      type: String,
      trim: true,
      required: [true, 'Passowrd is required!'],
    },
  },
  { timestamps: true }
);

uesrSchema.plugin(uniqueValidator);

uesrSchema.index({ firstName: 'text', lastName: 'text' });

uesrSchema.virtual('blogs', {
  ref: 'Blog',
  localField: '_id',
  foreignField: 'author',
});

const User = mongoose.model('User', uesrSchema);

module.exports = User;
