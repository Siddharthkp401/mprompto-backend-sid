const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const demoClient = new Schema({
    name: {
        type: String,
        required: true
    },
    ttl: {
        type: Date
    },
    email_ids: {
        type: Array
    },
    url: {
        type: String
    },
    title: {
        type: String
    },
});

module.exports = mongoose.model("DemoClient", demoClient);
