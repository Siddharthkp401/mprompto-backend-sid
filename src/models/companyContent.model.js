import mongoose from 'mongoose';
import validator from 'validator';
import { toJSON, paginate } from './plugins/index';

const companyContentSchema = new mongoose.Schema({
    company_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Company'
    },
    content_type: {
        type: Number
        // 1 - external content(url) 
        // 2 - document (file) 
        // 3 - FAQs in the form on Excel or custom database feed
        // 4 - Reviews and Ratings added to products
    },
    language: {
        type: String
    },
    content_state: {
        type: Number
    },
    /**
     * 1 - included
       2 - exculded
       3 - only for sandbox testing */
    content_audience: {
        type: Number

    },
    /**
     * 1 - everyone
    2 - testing
    3 - removed */

    time_used_in_answer: {
        type: Number,     /** number of minutes used for giving an ans. */
    },

    resolved: {
        type: Number,     /** number of resolved queries */

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
    })


companyContentSchema.plugin(toJSON);
companyContentSchema.plugin(paginate);


/**
 * @typedef comapnyContent
 */

const companyContent = mongoose.model('CompanyContent', companyContentSchema)

export default comapnyContent