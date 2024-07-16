const { getCompanyDatabase } = require("../utils/dbUtil");
const externalUrlSchema = require("../models/externalURL");
const CompanyContentSchema = require("../models/CompanyContentSchema");
const {
  externalUrlValidationSchema,
} = require("../validationSchemas/validationSchemas");

exports.addExternalURL = async (req, res) => {
  const { title, content_url } = req.body;
  const user = req.user;

  try {
    const { error } = externalUrlValidationSchema.validate({ content_url });

    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
        data: null,
      });
    }
    const companyId = user.company_id;
    console.log(companyId, "companyId");

    const companyDb = await getCompanyDatabase(companyId);
    const ExternalURL = companyDb.model("ExternalURL", externalUrlSchema);
    const CompanyContent = companyDb.model(
      "CompanyContent",
      CompanyContentSchema
    );

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

    const newExternalURL = new ExternalURL({
      company_content_id: companyContent._id,
      title: title || "",
      content_url,
      is_deleted: false,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const savedExternalURL = await newExternalURL.save();

    res.status(201).json({
      status: true,
      message: "External URL added successfully",
      data: savedExternalURL,
    });
  } catch (error) {
    console.error("Error in addExternalURL:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
      data: null,
    });
  }
};
