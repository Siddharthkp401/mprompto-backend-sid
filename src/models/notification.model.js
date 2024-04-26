import mongoose from "mongoose";
import { toJSON, paginate } from './plugins/index.js';

const notificationSchema = mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        notification: {
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

// add plugin that converts mongoose to json
notificationSchema.plugin(toJSON);
notificationSchema.plugin(paginate);


/**
 * @typedef Notification
 */
const Notification = mongoose.model('Notification', notificationSchema);

export default Notification
