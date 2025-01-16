const DemoClient = require("../../models/demo/client.schema");
const { registerDemoClientSchema } = require("../../validationSchemas/demo/clientValidationSchemas");

exports.create = async (req, res) => {
    const { error } = registerDemoClientSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
        data: null,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Demo client created successfully.",
    });
};