import mongoose from 'mongoose';
import { toJSON } from './plugins';


const urlContentSchema = new mongoose.Schema({
    title: {
        type: String
    },
    company_content_id: {
        type: mongoose.Types.ObjectId,
        ref: 'CompanyContent'
    },
    content_url: {
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
    })

urlContentSchema.plugin(toJSON);
urlContentSchema.plugin(paginate);

/**
 * @typedef UrlContent
 */

const UrlContent = mongoose.model('UrlContent', urlContentSchema);

export default UrlContent;