const { getCompanyDatabase } = require("../utils/dbUtil");
const externalUrlSchema = require("../models/externalURL");
const CompanyContentSchema = require("../models/companyContentSchema");
const fs = require("fs");
const XLSX = require("xlsx");
const path = require("path");
const {
  externalUrlValidationSchema,
} = require("../validationSchemas/validationSchemas");

exports.addExternalURL = async (req, res) => {
  const { title, content_url, type } = req.body;
  const user = req.user;

  if (!type || !["single", "multi"].includes(type)) {
    return res.status(400).json({
      status: false,
      message: "Invalid type specified",
      data: null,
    });
  }

  try {
    const companyId = user.company_id;
    console.log(companyId, "companyId");

    const companyDb = await getCompanyDatabase(companyId);
    const ExternalURL = companyDb.model("ExternalURL", externalUrlSchema);
    const CompanyContent = companyDb.model(
      "CompanyContent",
      CompanyContentSchema
    );

    const newCompanyContent = new CompanyContent({
      company_id: companyId,
      content_type: 0,
      language: "English",
      content_state: 1,
      content_audience: 0,
      is_deleted: false,
      created_at: new Date(),
      updated_at: new Date(),
    });
    const savedCompanyContent = await newCompanyContent.save();

    if (type === "single") {
      const { error } = externalUrlValidationSchema.validate({
        title,
        content_url,
      });
      if (error) {
        return res.status(400).json({
          status: false,
          message: error.details[0].message,
          data: null,
        });
      }

      const newExternalURL = new ExternalURL({
        company_content_id: savedCompanyContent._id,
        title: title || "",
        content_url,
        is_deleted: false,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const savedExternalURL = await newExternalURL.save();

      savedCompanyContent.content_type = 1;
      await savedCompanyContent.save();

      return res.status(201).json({
        status: true,
        message: "External URL added successfully",
        data: {
          externalURL: savedExternalURL,
          companyContent: savedCompanyContent,
        },
      });
    } else if (type === "multi") {
      const { file } = req;

      if (!file) {
        return res.status(400).json({
          status: false,
          message: "Excel file is required",
          data: null,
        });
      }

      const filePath = path.join(__dirname, "../uploads", req.file.filename); // eslint-disable-line no-undef
      const workbook = XLSX.readFile(filePath);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const urls = XLSX.utils
        .sheet_to_json(worksheet, { header: 1 })
        .flat()
        .filter((url) => {
          const urlRegex = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/i;
          return urlRegex.test(url);
        });

      const savedUrls = [];

      for (const url of urls) {
        const newExternalURL = new ExternalURL({
          company_content_id: savedCompanyContent._id,
          title: title || "",
          content_url: url,
          is_deleted: false,
          created_at: new Date(),
          updated_at: new Date(),
        });

        const savedExternalURL = await newExternalURL.save();
        savedUrls.push(savedExternalURL);
      }

      // Update company content type
      savedCompanyContent.content_type = 1;
      await savedCompanyContent.save();

      // Optionally delete the uploaded Excel file after processing
      fs.unlinkSync(filePath);

      return res.status(201).json({
        status: true,
        message: "External URLs added successfully",
        data: {
          externalURLs: savedUrls,
          companyContent: savedCompanyContent,
        },
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "Invalid type specified",
        data: null,
      });
    }
  } catch (error) {
    console.error("Error in addExternalURL:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
      data: null,
    });
  }
};
