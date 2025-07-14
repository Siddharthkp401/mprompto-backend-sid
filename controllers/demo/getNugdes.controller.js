const Nudge = require("../../models/demo/nudge.schema");

exports.getNudges = async (req, res) => {
    try {
        // Fetch all nudges from the collection
        let nudges = await Nudge.find({}).lean();

        if (!nudges || nudges.length === 0) {
            return res.status(404).json({ message: "No nudges found" });
        }

        return res.status(200).json({
            message: "Nudges fetched successfully",
            data: nudges,
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
