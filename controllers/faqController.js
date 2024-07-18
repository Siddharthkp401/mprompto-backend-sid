const { getCompanyDatabase } = require("../utils/dbUtil");
const CompanyContentSchema = require("../models/companyContentSchema");
const faqSchema = require("../models/faq");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");
const { singleFAQSchema } = require("../validationSchemas/validationSchemas");

exports.addFAQ = async (req, res) => {
  const { title, question, answer, type } = req.body;
  const user = req.user;

  try {
    const companyId = user.company_id;

    const companyDb = await getCompanyDatabase(companyId);
    const FAQ = companyDb.model("FAQ", faqSchema);
    const CompanyContent = companyDb.model(
      "CompanyContent",
      CompanyContentSchema
    );

    // Always create a new CompanyContent record
    const newCompanyContent = new CompanyContent({
      company_id: companyId,
      content_type: 2, // Content type for FAQ
      language: "English",
      content_state: 1,
      content_audience: 0,
      is_deleted: false,
      created_at: new Date(),
      updated_at: new Date(),
    });
    const savedCompanyContent = await newCompanyContent.save();

    if (type === "single") {
      const { error } = singleFAQSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        return res.status(400).json({
          status: false,
          message: "Validation errors",
          data: error.details.map((err) => err.message),
        });
      }

      const newFAQ = new FAQ({
        company_content_id: savedCompanyContent._id,
        title,
        question,
        answer,
        is_deleted: false,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const savedFAQ = await newFAQ.save();

      return res.status(201).json({
        status: true,
        message: "FAQ added successfully",
        data: {
          faq: savedFAQ,
          companyContent: savedCompanyContent,
        },
      });
    }

    // Handle multiple FAQs from Excel file upload
    if (type === "multi") {
      if (!req.file) {
        return res.status(400).json({
          status: false,
          message: "File is required for multiple FAQs",
          data: null,
        });
      }

      const filePath = path.join(__dirname, "../uploads", req.file.filename); // eslint-disable-line no-undef
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
        header: 1,
      });

      const headers = data[0];
      const rows = data.slice(1);

      const faqs = rows.map((row) => {
        const faqObject = {};
        headers.forEach((header, index) => {
          faqObject[header.toLowerCase()] = row[index];
        });
        return {
          company_content_id: savedCompanyContent._id,
          title: faqObject["title"],
          question: faqObject["questions"],
          answer: faqObject["answer"],
          is_deleted: false,
          created_at: new Date(),
          updated_at: new Date(),
        };
      });

      const savedFAQs = await FAQ.insertMany(faqs);

      // Clean up: Delete the uploaded file after processing
      // fs.unlinkSync(filePath);

      return res.status(201).json({
        status: true,
        message: "FAQs added successfully",
        data: {
          faqs: savedFAQs,
          companyContent: savedCompanyContent,
        },
      });
    }

    return res.status(400).json({
      status: false,
      message: "Invalid type",
      data: null,
    });
  } catch (error) {
    console.error("Error in addFAQ:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      data: null,
    });
  }
};
