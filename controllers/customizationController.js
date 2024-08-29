const path = require("path");
const { getCompanyDatabase } = require("../utils/dbUtil");
const Customization = require("../models/customizationModel");

exports.addCustomizationData = async (req, res) => {
  const user = req.user;
  const companyId = user.company_id;

  const customizationData = req.body;
  let logo = req.file ? path.basename(req.file.path) : "";

  try {
    const companyDb = await getCompanyDatabase(companyId);
    const CustomizationModel = companyDb.model(
      "Customization",
      Customization.schema
    );

    const existingCustomization = await CustomizationModel.findOne({
      company_id: companyId,
      is_deleted: false,
    });

    if (!existingCustomization) {
      const newCustomization = new CustomizationModel({
        ...customizationData,
        logo: logo || "",
        created_at: new Date(),
        updated_at: new Date(),
      });
      await newCustomization.save();
      return res.status(200).json({
        status: true,
        message: "Customization data created successfully",
        data: newCustomization,
      });
    } else {
      const updatedCustomization = await CustomizationModel.findOneAndUpdate(
        { company_id: companyId, is_deleted: false },
        {
          ...customizationData,
          logo: logo || existingCustomization.logo,
          updated_at: new Date(),
        },
        { new: true, upsert: true }
      );
      return res.status(200).json({
        status: true,
        message: "Customization data updated successfully",
        data: updatedCustomization,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      data: null,
    });
  }
};
