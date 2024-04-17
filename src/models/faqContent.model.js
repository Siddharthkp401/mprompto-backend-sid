const { toJSON } = require('./plugins');
const { mongoose } = require("../config/config");

const faqContentSchema = new mongoose.Schema({

    company_content_id: {
        type: mongoose.Types.ObjectId,
        ref: 'CompanyContent'
    },
    title: {
        type: String
    },
    question: {
        type: String
    },
    answer: {
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


faqContentSchema.plugin(toJSON);
faqContentSchema.plugin(paginate);


/**
 * @typedef faqContent
 */

const faqContent = mongoose.model('faqContent', faqContentSchema)
module.exports = faqContent;