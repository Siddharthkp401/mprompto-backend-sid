const mongoose = require("mongoose");
const DemoClient = require("../../models/demo/client.schema");

exports.addQuestionsData = async (req, res) => {
    try {
        const { id, data, whyData } = req.body;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Entered ID does not exist" });
        }

        // Check if the record exists by ID
        const client = await DemoClient.findById(id);

        if (!client) {
            return res.status(404).json({ message: "ID not found." });
        }

        client.data = data;
        client.q_and_a_status = "Completed";
        client.whyData = whyData;

        await client.save();

        res.status(200).json({
            message: "Data updated successfully",
            client,
        });
    } catch (error) {
        console.error("Error updating data:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
