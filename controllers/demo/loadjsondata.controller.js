const mongoose = require('mongoose');
const DemoClient = require("../../models/demo/client.schema");

exports.addQuestionsData = async (req, res) => {
    try {
        const { id, data } = req.body;

        // if (!id || !Array.isArray(data) || data.length === 0) {
        //     return res.status(400).json({ message: "Invalid request data" });
        // }

        // Check if the ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Enter id does not exits" });
        }

        // Check if the record exists by ID
        const client = await DemoClient.findById(id);

        if (!client) {
            return res.status(404).json({ message: "ID not found." });
        }

        client.data = data;
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
