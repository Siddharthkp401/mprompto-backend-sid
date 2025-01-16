const DemoClient = require("../../models/demo/client.schema");
const { registerDemoClientSchema } = require("../../validationSchemas/demo/clientValidationSchemas");

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

    const { id, name, ttl, email_ids, url, title, status } = value;

    if (id) {
      const existingClientByName = await DemoClient.findOne({ name });
      if (existingClientByName && existingClientByName._id.toString() !== id) {
        return res.status(400).json({
          status: false,
          message: "A client with this name already exists.",
          data: null,
        });
      }

      const updatedClient = await DemoClient.findByIdAndUpdate(
        id,
        { name, ttl, email_ids, url, title, status },
        { new: true }
      );

      if (!updatedClient) {
        return res.status(404).json({
          status: false,
          message: "Client not found.",
          data: null,
        });
      }

      return res.status(200).json({
        status: true,
        message: "Demo client updated successfully.",
        data: updatedClient,
      });
    } else {
      // If no `id` is provided, create a new client
      const existingClientByName = await DemoClient.findOne({ name });
      if (existingClientByName) {
        return res.status(400).json({
          status: false,
          message: "A client with this name already exists.",
          data: null,
        });
      }

      const newClient = new DemoClient({
        name,
        ttl,
        email_ids,
        url,
        title,
        status: status || "Initiated",
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
