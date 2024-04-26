import mongoose from 'mongoose';
import { paginate, toJSON } from './plugins/index.js';

const faqContentSchema = new mongoose.Schema(
  {
    company_content_id: {
      type: mongoose.Types.ObjectId,
      ref: 'CompanyContent',
    },
    title: {
      type: String,
    },
    question: {
      type: String,
    },
    answer: {
      type: String,
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

faqContentSchema.plugin(toJSON);
faqContentSchema.plugin(paginate);

/**
 * @typedef faqContent
 */

const FaqContent = mongoose.model('faqContent', faqContentSchema);

export default FaqContent;
