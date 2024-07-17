const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fileSchema = new Schema({
  company_content_id: {
    type: Schema.Types.ObjectId,
    ref: "CompanyContent",
    required: true,
  },
  title: { type: String, default: "" },
  filename: { type: String, required: true },
  filepath: { type: String, required: true },
  filesize: { type: String, required: true },
  pdf_url: { type: String, default: "", required: false },
  is_deleted: { type: Boolean, default: false },
  deleted_at: { type: Date, default: null },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = fileSchema;
