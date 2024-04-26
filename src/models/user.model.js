import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { toJSON, paginate } from './plugins/index.js';

const userSchema = mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    mobile_number: {
      type: Number,
      // required: [true, 'Mobile number is required'],
      unique: true,

    },
    password: {
      type: String,
      // required: true,
      trim: true,
      // minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    social_login_id: {
      type: String,
      default: null
    },
    login_with: {
      type: String,
      default: 'default',
      enum: ['facebook', 'google', 'default']
    },
    user_question_answers: {
      type: [Object],
      default: []
    },
    email_verified: {
      type: Boolean,
      default: false,
    },
    otp_verified: {
      type: Boolean,
      default: false,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.statics.isMobileNumberTaken = async function (mobile_number, excludeUserId) {
  const user = await this.findOne({ mobile_number, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  let pass = bcrypt.compareSync(password, user.password);
  return pass
};

// userSchema.pre('save', async function (next) {
//   const user = this;
//   if (user.isModified('password')) {
//     user.password = await bcrypt.hashSync(user.password, 8);
//   }
//   next();
// });

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

export default User;
