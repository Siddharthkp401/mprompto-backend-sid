import mongoose from 'mongoose';
import { toJSON } from './plugins/index.js';


const fileContentSchema = new mongoose.Schema({
    company_content_id: {
        type: mongoose.Types.ObjectId,
        ref: 'CompanyContent'
    },
    title: {
        type: String
    },
    filename: {
        type: String
    },
    filepath: {
        type: String
    },
    filesize:{
        type: Number
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


fileContentSchema.plugin(toJSON);
fileContentSchema.plugin(paginate);


/**
 * @typedef fileContent
 */

const fileContent = mongoose.model('fileContent', fileContentSchema)

export default fileContent