
exports.submitAnswer = async (req, res) => {
    try {
        // Fetch all nudges from the collection
        console.log("req------", req.body);
        return res.status(200).json({
            message: "Answer submitted successfully"
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
