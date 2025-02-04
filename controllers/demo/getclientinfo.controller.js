const DemoClient = require("../../models/demo/client.schema");


exports.getClients = async (req, res) => {
    try {
        const { page = 1, limit = 10, status = "", language = "English", search = "" } = req.query;

        const skip = (page - 1) * limit;

        const query = {};

        // Filter by status if not "ALL"
        if (status !== "") {
            query.status = status;
        }

        // Filter by language
        if (language) {
            query.language = language;
        }

        // Search by name, email_ids, or title
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email_ids: { $regex: search, $options: "i" } },
                { title: { $regex: search, $options: "i" } }
            ];
        }

        // Fetch filtered clients with pagination
        const clients = await DemoClient.find(query)
            .skip(skip)
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        const totalCount = await DemoClient.countDocuments(query);

        return res.status(200).json({
            status: true,
            message: "Clients fetched successfully.",
            data: {
                clients,
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
                currentPage: Number(page),
            },
        });
    } catch (err) {
        console.error("Error fetching clients:", err);
        return res.status(500).json({
            status: false,
            message: "An internal server error occurred.",
            data: null,
        });
    }
};

