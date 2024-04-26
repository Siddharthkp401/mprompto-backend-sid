import mongoose from 'mongoose';
import { toJSON, paginate } from './plugins/index.js';

const reviewRatingSchema = new mongoose.Schema(
  {
    company_content_id: {
      type: mongoose.Types.ObjectId,
      ref: 'CompanyContent',
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

reviewRatingSchema.plugin(toJSON);
reviewRatingSchema.plugin(paginate);

/**
 * @typedef reviewRating
 */

const ReviewRating = mongoose.model('reviewRating', reviewRatingSchema);
export default ReviewRating;
