const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const demoClientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: false
    },
    ttl: {
      type: Date,
    },
    email_ids: {
      type: [String],
      validate: {
        validator: function (emails) {
          return emails.every((email) =>
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
          );
        },
        message: "Invalid email address in the email_ids array.",
      },
    },
    url: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["Initiated", "Active", "Expired"],
      default: "Initiated",
    },
    language: {
      type: String,
      default: "English",
    },
    data: {
      type: Object,
      default: {},
      required: true,
    },
    whyData: {
      type: Object,
      default: {},
      required: true,
    },
    screenshotPath: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DemoClient", demoClientSchema, "demo_clients");
