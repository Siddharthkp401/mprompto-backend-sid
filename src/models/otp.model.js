const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
// const { tokenTypes } = require('../config/tokens');

const otpSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    mobile_number: {
      type: Number,
    },
    email: {
      type: String
    },

    otp: {
      type: Number,
    },
    expires_at: {
      type: Date,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
otpSchema.plugin(toJSON);

/**
 * @typedef Token
 */
const Otp = mongoose.model('Otp', otpSchema);

module.exports = Otp;
