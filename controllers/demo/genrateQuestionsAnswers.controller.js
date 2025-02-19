const DemoClient = require("../../models/demo/client.schema");
const axios = require("axios");

exports.generateQAndA = async (req, res) => {
    try {
        const { id, question_generation_prompt, answer_generation_prompt, primary_text, secondary_text } = req.body;

        if (!id || !question_generation_prompt || !answer_generation_prompt) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const client = await DemoClient.findById(id);
        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }

        client.primary_text = primary_text || client.primary_text;
        client.secondary_text = secondary_text || client.secondary_text;
        await client.save();

        // Call AI API
        // const aiApiUrl = "https://your-ai-api.com/generate-qna";
        // const aiApiResponse = await axios.post(aiApiUrl, {
        //     question_prompt: question_generation_prompt,
        //     answer_prompt: answer_generation_prompt,
        // });


        // Mock AI API response
        const mockAiResponse = {
            question: "What is Node.js?",
            answer: "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine.",
        };

        // Respond with AI API response
        return res.status(200).json({
            message: "Q&A generated successfully",
            aiResponse: mockAiResponse,
        });
    } catch (error) {
        console.error("Error generating Q&A:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
