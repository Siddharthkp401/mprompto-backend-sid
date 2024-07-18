const { getCompanyDatabase } = require("../utils/dbUtil");
const CompanyContentSchema = require("../models/companyContentSchema");
const faqSchema = require("../models/faq");
const externalUrlSchema = require("../models/externalURL");
const fileSchema = require("../models/file");
// const reviewRatingSchema = require("../models/reviewRating");

exports.listCompanyContent = async (req, res) => {
  const user = req.user;
  const companyId = user.company_id;

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

    const companyContents = await CompanyContent.find({
      company_id: companyId,
      is_deleted: false,
    });
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
