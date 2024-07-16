const { getCompanyDatabase } = require("../utils/dbUtil");
const fileSchema = require("../models/file");
const CompanyContentSchema = require("../models/companyContentSchema");

exports.addFile = async (req, res) => {
  const { title, filename, filepath, filesize } = req.body;
  const user = req.user;

  try {
    const companyId = user.company_id;
    console.log(companyId, "companyId");

    const companyDb = await getCompanyDatabase(companyId);
    const File = companyDb.model("File", fileSchema);
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

    const newFileData = {
      company_content_id: companyContent._id,
      filename,
      filepath,
      filesize,
      is_deleted: false,
      created_at: new Date(),
      updated_at: new Date(),
    };

    if (title) {
      newFileData.title = title;
    } else {
      newFileData.title = "";
    }

    const newFile = new File(newFileData);
    const savedFile = await newFile.save();

    res.status(201).json({
      status: true,
      message: "File added successfully",
      data: savedFile,
    });
  } catch (error) {
    console.error("Error in addFile:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
      data: null,
    });
  }
};
