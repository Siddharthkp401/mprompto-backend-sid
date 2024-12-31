const { getCompanyDatabase } = require("../utils/dbUtil");
const CompanyContentSchema = require("../models/companyContent.schema");
const faqSchema = require("../models/faq.schema");
const externalUrlSchema = require("../models/externalURL.schema");
const documentSchema = require("../models/document.schema");

exports.getCompanyContent = async (req, res) => {
    const { company_id } = req.body;

    if (!company_id) {
        return res.status(400).json({
            status: false,
            message: "Company ID is required",
        });
    }

    try {
        const companyDb = await getCompanyDatabase(company_id);
        console.log('companyDb :', companyDb);

        const FAQ = companyDb.model("FAQ", faqSchema);
        const ExternalURL = companyDb.model("ExternalURL", externalUrlSchema);
        const File = companyDb.model("Document", documentSchema);

        const faqs = await FAQ.find({ company_id: company_id, is_deleted: false }, '_id question answer');
        const externalUrls = await ExternalURL.find({ company_id: company_id, is_deleted: false }, '_id title content_url');
        const files = await File.find({ company_id: company_id, is_deleted: false }, '_id filename filepath language');

        return res.status(200).json({
            status: true,
            message: "Company content retrieved successfully",
            data: {
                faqs,
                externalUrls,
                files,
            },
        });
    } catch (error) {
        console.error("Error in getCompanyContent:", error);
        return res.status(500).json({
            status: false,
            message: "Internal server error",
            data: null,
        });
    }
};
