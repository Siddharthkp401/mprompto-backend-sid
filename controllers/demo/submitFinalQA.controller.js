const DemoClient = require("../../models/demo/client.schema");

exports.updateFinalData = async (req, res) => {
    try {
        const { clientId, qa } = req.body;

        if (!clientId || !qa || !Array.isArray(qa)) {
            return res.status(400).json({ message: "Invalid input data" });
        }

        // Ensure all objects have `is_checked: true`
        const updatedQa = qa.map(item => ({
            ...item,
            is_checked: true
        }));

        const updatedClient = await DemoClient.findByIdAndUpdate(
            clientId,
            { $set: { final_data: { qa: updatedQa }, "data.qa": [] } },
            { new: true }
        );

        if (!updatedClient) {
            return res.status(404).json({ message: "Client not found" });
        }

        res.status(200).json({ message: "Final data updated successfully", data: updatedClient });
    } catch (error) {
        console.error("Error updating final data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
