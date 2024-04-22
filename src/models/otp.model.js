import mongoose from "mongoose";
import { toJSON } from './plugins/index.js';

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

export default Otp;
