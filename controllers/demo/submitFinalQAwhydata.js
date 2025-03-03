const DemoClient = require("../../models/demo/client.schema");

exports.submitFinalWhyData = async (req, res) => {
    try {
        const { id, qa } = req.body;

        if (!id || !Array.isArray(qa)) {
            return res.status(400).json({ message: "Invalid request data." });
        }

        const updatedQa = qa.map(item => ({
            ...item,
            is_checked: true
        }));

        const updatedClient = await DemoClient.findByIdAndUpdate(
            id,
            { $set: { final_why_data: { qa: updatedQa }, "whyData.qa": [] } },
            { new: true, runValidators: true }
        );

        if (!updatedClient) {
            return res.status(404).json({ message: "Client not found." });
        }

        return res.status(200).json({
            message: "Final why data submitted successfully.",
            data: updatedClient.final_why_data
        });
    } catch (error) {
        console.error("Error submitting final why data:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};
