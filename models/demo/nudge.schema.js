const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const nudgeSchema = new Schema(
    {
        type: { type: String, required: true },
        question: { type: String, required: true },
        options: [{ type: String }], // optional
    },
    { timestamps: true }
);

const Nudge = mongoose.models.demo_nudgeschema || mongoose.model("demo_nudgeschema", nudgeSchema, "demo_nudge_collection");

module.exports = Nudge;
