const { promisify } = require('util');
const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { jwtSecretKey } = require('../config');

const jwtSign = promisify(jwt.sign);

const userSchema = new mongoose.Schema(
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
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: [true, 'Gender is required!'],
    },
    slug: {
      type: String,
      slug: ['firstName', 'lastName'],
      slug_padding_size: 3,
      unique: true,
    },
    follows: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true, toObject: { virtuals: true } }
);

userSchema.plugin(slug);

userSchema.plugin(uniqueValidator, {
  message: '{VALUE} is already in use',
});

userSchema.index({ firstName: 'text', lastName: 'text' });

userSchema.virtual('blogs', {
  ref: 'Blog',
  localField: '_id',
  foreignField: 'author',
});

userSchema.pre('save', async function () {
  if (this.isModified('password'))
    this.password = await bcrypt.hash(this.password, 8);
});

userSchema.statics.findByCredentials = async ({ email, password }) => {
  // Find by email only beacuse indexing
  const user = await User.findOne({ email });
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);
  return isMatch ? user : null;
};

userSchema.methods.genereateAuthToken = function () {
  return jwtSign({ _id: this._id }, jwtSecretKey, { expiresIn: '12h' });
};

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  return { ...user, password: undefined, __v: undefined };
};

const User = mongoose.model('User', userSchema);

module.exports = User;
