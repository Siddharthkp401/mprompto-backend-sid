const { getCompanyDatabase } = require("../utils/dbUtil");
const CompanyContentSchema = require("../models/companyContentSchema");
const faqSchema = require("../models/faq");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");

exports.addFAQ = async (req, res) => {
  const { title, question, answer, type } = req.body;
  const user = req.user;

  try {
    // Retrieve companyId from authenticated user
    const companyId = user.company_id;

    // Get company database based on companyId
    const companyDb = await getCompanyDatabase(companyId);
    const FAQ = companyDb.model("FAQ", faqSchema);
    const CompanyContent = companyDb.model(
      "CompanyContent",
      CompanyContentSchema
    );

    // Check if there is existing company content record, create if not
    let companyContent = await CompanyContent.findOne({
      company_id: companyId,
    });
    if (!companyContent) {
      companyContent = new CompanyContent({
        company_id: companyId,
        content_type: 0,
        language: "English",
        content_state: 1,
        content_audience: 0,
        is_deleted: false,
        created_at: new Date(),
        updated_at: new Date(),
      });
      await companyContent.save();
    }

    // Handle single FAQ addition
    if (type === "single") {
      const newFAQ = new FAQ({
        company_content_id: companyContent._id,
        title,
        question,
        answer,
        is_deleted: false,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const savedFAQ = await newFAQ.save();

      console.log(savedFAQ, "56");

      return res.status(201).json({
        status: true,
        message: "FAQ added successfully",
        data: savedFAQ,
      });
    }

    // Handle multiple FAQs from Excel file upload
    if (type === "multi" && req.file) {
      console.log(req.file, "file");
      const filePath = path.join(__dirname, "../uploads", req.file.filename);
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

      console.log(data, "data");

      const faqs = data.map((row) => ({
        company_content_id: companyContent._id,
        title: row.title,
        question: row.question,
        answer: row.answer,
        is_deleted: false,
        created_at: new Date(),
        updated_at: new Date(),
      }));

      const savedFAQs = await FAQ.insertMany(faqs);

      // Clean up: Delete the uploaded file after processing
      fs.unlinkSync(filePath);

      return res.status(201).json({
        status: true,
        message: "FAQs added successfully",
        data: savedFAQs,
      });
    }

    // Invalid request type or missing file in case of multi
    return res.status(400).json({
      status: false,
      message: "Invalid type or missing file",
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
