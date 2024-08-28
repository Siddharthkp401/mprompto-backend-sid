const { getCompanyDatabase } = require("../utils/dbUtil");
const customizationModel = require("../models/customizationModel");

exports.getCustomizationData = async (req, res) => {
  const user = req.user;
  const companyId = user.company_id;

  try {
    const companyDb = await getCompanyDatabase(companyId);
    const CustomizationModel = companyDb.model(
      "Customization",
      customizationModel.schema
    );

    const customization = await CustomizationModel.findOne({
      company_id: companyId,
      is_deleted: false,
    });

    if (!customization) {
      return res.status(404).json({
        status: false,
        message: "Customization data not found",
        data: null,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Customization data retrieved successfully",
      data: customization,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      data: null,
    });
  }
};
