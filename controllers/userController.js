const {
  updateUserAndCreateCompanySchema,
} = require("../validationSchemas/validationSchemas");
const Company = require("../models/companySchema");
const { createCompanyDatabase } = require("../utils/createCompanyDatabase");

exports.updateUserAndCreateCompany = async (req, res) => {
  console.log(req.user, "user from token");
  const {
    name,
    country_code,
    mobile_number,
    company_name,
    min_company_size,
    max_company_size,
    company_website,
  } = req.body;

  try {
    const user = req.user;
    // console.log(user, "user from DB");

    const { error } = updateUserAndCreateCompanySchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(200).json({
        status: false,
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
        data: null,
      });
    }

    user.name = name;
    user.country_code = country_code;
    user.mobile_number = mobile_number;
    await user.save();
    // console.log(user, "updated user");

    const { dbName } = await createCompanyDatabase(company_name);

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

    user.company_id = savedCompany._id;
    await user.save();
    // console.log(user, "user with company_id");

    res.status(200).json({
      status: true,
      message: "Company registration successfully",
      data: {
        user,
        // companyContent,
        company: savedCompany,
      },
    });
  } catch (error) {
    // console.error("Error in updateUserAndCreateCompany:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
      data: null,
    });
  }
};
