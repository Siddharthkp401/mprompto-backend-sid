import mongoose from 'mongoose';
import validator from 'validator';
import { toJSON, paginate } from './plugins/index.js';

const companySchema = mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
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
companySchema.plugin(toJSON);


/**
 * @typedef Company
 */
const User = mongoose.model('Company', companySchema);
export default User