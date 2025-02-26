const DemoClient = require("../../models/demo/client.schema");
const { registerDemoClientSchema } = require("../../validationSchemas/demo/clientValidationSchemas");
const { captureScreenshot } = require("./screenshotHelper");

exports.createOrUpdate = async (req, res) => {
  try {
    const { error, value } = registerDemoClientSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details[0].message.replace(/"/g, ""),
        data: null,
      });
    }

    const { id, name, ttl, email_ids, url, title, status, data_cleaned_status } = value;

    let screenshotPath = null;
    if (url) {
      screenshotPath = await captureScreenshot(url); // Capture screenshot
    }

    if (id) {
      // Update existing client
      const updatedClient = await DemoClient.findByIdAndUpdate(
        id,
        { name, ttl, email_ids, url, title, status, data_cleaned_status, screenshotPath },
        { new: true }
      );

      if (!updatedClient) {
        return res.status(204).json({
          status: false,
          message: "There is no content to send for this request.",
          data: null,
        });
      }

      return res.status(200).json({
        status: true,
        message: "Demo client updated successfully.",
        data: updatedClient,
      });
    } else {
      // Create a new client
      const newClient = new DemoClient({
        name,
        ttl,
        email_ids,
        url,
        title,
        status: status || "Completed",
        data_cleaned_status: data_cleaned_status || "In-Progress",
        screenshotPath,
      });

      await newClient.save();

      return res.status(201).json({
        status: true,
        message: "Demo client created successfully.",
        data: newClient,
      });
    }
  } catch (err) {
    console.error("Error creating or updating demo client:", err);
    return res.status(500).json({
      status: false,
      message: "An internal server error occurred.",
      data: null,
    });
  }
};
