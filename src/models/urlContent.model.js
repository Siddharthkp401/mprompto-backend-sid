import mongoose from 'mongoose';
import { toJSON, paginate } from './plugins/index.js';

const urlContentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: 'title',

    },
    company_content_id: {
      type: mongoose.Types.ObjectId,
      ref: 'CompanyContent',
    },
    content_url: {
      type: String,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    parent_url: {
      type: Boolean,
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

urlContentSchema.plugin(toJSON);
urlContentSchema.plugin(paginate);

/**
 * @typedef UrlContent
 */

const UrlContent = mongoose.model('UrlContent', urlContentSchema);

export default UrlContent;
