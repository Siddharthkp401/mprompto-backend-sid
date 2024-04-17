const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const tempUserSchema = mongoose.Schema(
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
            required: [true, 'Mobile number is required'],
            unique: true,

        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 8,
            validate(value) {
                if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
                    throw new Error('Password must contain at least one letter and one number');
                }
            },
            private: true, // used by the toJSON plugin
        },
        company_name: {
            type: String,
        },
        min_company_size: {
            type: Number
        },
        max_company_size: {
            type: Number
        },
        company_website: {
            type: String
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
tempUserSchema.plugin(toJSON);
tempUserSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
tempUserSchema.statics.isEmailTaken = async function (email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId }, email_verified: false });
    return !!user;
};

/**
 * Check if mobile_number is taken
 * @param {number} mobile_number - The user's mobile number
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */

tempUserSchema.statics.isMobileNumberTaken = async function (mobile_number, excludeUserId) {
    const user = await this.findOne({ mobile_number, _id: { $ne: excludeUserId }, email_verified: false });
    return !!user;
  };

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
tempUserSchema.methods.isPasswordMatch = async function (password) {
    const user = this;
    return bcrypt.compare(password, user.password);
};

tempUserSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

/**
 * @typedef TempUser
 */
const TempUser = mongoose.model('TempUser', tempUserSchema);

module.exports = TempUser;
