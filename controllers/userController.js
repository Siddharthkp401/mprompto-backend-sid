const {
  updateUserAndCreateCompanySchema,
} = require("../validationSchemas/validationSchemas");
const Company = require("../models/CompanySchema");
const { createCompanyDatabase } = require("../utils/createCompanyDatabase");

exports.updateUserAndCreateCompany = async (req, res) => {
  console.log(req.user, "user from token");
  const {
    fullname,
    country_code,
    mobile_number,
    company_name,
    min_company_size,
    max_company_size,
    company_website,
  } = req.body;

  try {
    const user = req.user;
    console.log(user, "user from DB");

    const { error } = updateUserAndCreateCompanySchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        status: false,
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
        data: null,
      });
    }

    user.fullname = fullname;
    user.country_code = country_code;
    user.mobile_number = mobile_number;
    await user.save();
    console.log(user, "updated user");

    const { dbName, CompanyContent } = await createCompanyDatabase(
      company_name
    );

    const newCompany = new Company({
      user_id: user._id,
      company_name,
      db_name: dbName,
      min_company_size,
      max_company_size,
      company_website,
      is_deleted: false,
      created_at: new Date(),
      updated_at: new Date(),
    });
    const savedCompany = await newCompany.save();

    const companyContent = new CompanyContent({
      company_id: savedCompany._id,
      content_type: 0,
      language: "English",
      content_state: 1,
      content_audience: 0,
      is_deleted: false,
      created_at: new Date(),
      updated_at: new Date(),
    });
    await companyContent.save();

    user.company_id = savedCompany._id;
    await user.save();
    console.log(user, "user with company_id");

    res.status(200).json({
      status: true,
      message: "User updated and company created successfully",
      data: {
        user,
        companyContent,
        company: savedCompany,
      },
    });
  } catch (error) {
    console.error("Error in updateUserAndCreateCompany:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
      data: null,
    });
  }
};
