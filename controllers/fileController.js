const { getCompanyDatabase } = require("../utils/dbUtil");
const fileSchema = require("../models/file");
const CompanyContentSchema = require("../models/companyContentSchema");
const { fileUploadSchema } = require("../validationSchemas/validationSchemas");

exports.addFile = async (req, res) => {
  const { title, pdf_url } = req.body;
  const user = req.user;

  const { filename, path: filepath, size: filesize } = req.file;

  const { error } = fileUploadSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: false,
      message: error.details[0].message,
      data: null,
    });
  }

  try {
    const companyId = user.company_id;

    const companyDb = await getCompanyDatabase(companyId);
    const File = companyDb.model("File", fileSchema);
    const CompanyContent = companyDb.model(
      "CompanyContent",
      CompanyContentSchema
    );

    const newCompanyContent = new CompanyContent({
      company_id: companyId,
      content_type: 'Files',
      language: "English",
      content_audience: 0,
      is_deleted: false,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const savedCompanyContent = await newCompanyContent.save();

    let companyContent = await CompanyContent.findOne({
      company_id: companyId,
    });

    if (!companyContent) {
      companyContent = new CompanyContent({
        company_id: companyId,
        language: "English",
        content_audience: 0,
        is_deleted: false,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }


    await companyContent.save();

    const newFileData = {
      company_content_id: savedCompanyContent._id,
      filename,
      filepath,
      filesize,
      pdf_url,
      is_deleted: false,
      created_at: new Date(),
      updated_at: new Date(),
    };

    newFileData.title = title || "";

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
