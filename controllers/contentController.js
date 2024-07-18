const { getCompanyDatabase } = require("../utils/dbUtil");
const CompanyContentSchema = require("../models/companyContentSchema");
const faqSchema = require("../models/faq");
const externalUrlSchema = require("../models/externalURL");
const fileSchema = require("../models/file");
// const reviewRatingSchema = require("../models/reviewRating");

exports.listCompanyContent = async (req, res) => {
  const user = req.user;
  const companyId = user.company_id;

  const { filters } = req.body;

  try {
    const companyDb = await getCompanyDatabase(companyId);
    const CompanyContent = companyDb.model(
      "CompanyContent",
      CompanyContentSchema
    );
    const FAQ = companyDb.model("FAQ", faqSchema);
    const ExternalURL = companyDb.model("ExternalURL", externalUrlSchema);
    const File = companyDb.model("File", fileSchema);
    // const ReviewRating = companyDb.model("ReviewRating", reviewRatingSchema);

    const companyContentQuery = {
      company_id: companyId,
      is_deleted: false,
    };

    if (filters && filters.content_state) {
      if (filters.content_state === "included") {
        companyContentQuery.content_state = { $in: ["included"] };
      } else if (filters.content_state === "excluded") {
        companyContentQuery.content_state = { $nin: ["excluded"] };
      } else if (filters.content_state === "sandbox") {
        companyContentQuery.content_state = "sandbox";
      }
    }

    if (filters && filters.language) {
      companyContentQuery.language = filters.language;
    }

    if (filters && filters.content_type) {
        const contentTypes = filters.content_type.split(",").map(type => type.trim());
          companyContentQuery.content_type = { $in: contentTypes };
      }

    const companyContents = await CompanyContent.find(companyContentQuery);
    const faqs = await FAQ.find({ is_deleted: false });
    const externalUrls = await ExternalURL.find({ is_deleted: false });
    const files = await File.find({ is_deleted: false });
    // const reviewRatings = await ReviewRating.find({ is_deleted: false });

    const contentList = companyContents.map((content) => ({
      ...content.toObject(),
      faqs: faqs.filter(
        (faq) => faq.company_content_id.toString() === content._id.toString()
      ),
      externalUrls: externalUrls.filter(
        (url) => url.company_content_id.toString() === content._id.toString()
      ),
      files: files.filter(
        (file) => file.company_content_id.toString() === content._id.toString()
      ),
      //   reviewRatings: reviewRatings.filter(
      //     (review) =>
      //       review.company_content_id.toString() === content._id.toString()
      //   ),
    }));

    if (contentList.length === 0) {
      return res.status(404).json({
        status: true,
        message: "No company content found",
        data: [],
      });
    }

    return res.status(200).json({
      status: true,
      message: "Company content retrieved successfully",
      data: contentList,
    });
  } catch (error) {
    console.error("Error in listCompanyContent:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      data: null,
    });
  }
};
