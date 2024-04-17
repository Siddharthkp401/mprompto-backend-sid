const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');


const reviewRatingSchema = new mongoose.Schema({
    company_content_id: {
        type: mongoose.Types.ObjectId,
        ref: 'CompanyContent'
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
)

reviewRatingSchema.plugin(toJSON);
reviewRatingSchema.plugin(paginate);

/**
 * @typedef reviewRating
 */

const reviewRating = mongoose.model('reviewRating', reviewRatingSchema)
module.exports = { reviewRating }