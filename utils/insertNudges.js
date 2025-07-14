const process = require("process");
const connectDB = require('../config/db');
const Nudge = require('../models/demo/nudge.schema');

// Provided array of nudge objects
const nudgesArray = [
  { type: "discrete", question: "Looks like you're weighing your options—smart move! Want help zeroing in on the right AC for your space?" },
  { type: "mcq", question: "Will this AC be used regularly during the daytime, or mostly at night?", options: ["Day & Night", "Mostly Night", "Mostly Day", "Not Sure Yet"] },
  {
    type: "mcq", question: "Which of these best describes your room?", options: [
      "Small (under 120 sq ft), shaded most of the day",
      "Medium (120–180 sq ft), moderate sunlight",
      "Large (180+ sq ft), gets direct sunlight",
      "Room has multiple people / gadgets that generate heat",
      "Not sure about size, but it gets warm quickly"
    ]
  },
  {
    type: "mcq", question: "Which of these matters most to you in daily use?", options: [
      "Fast Cooling",
      "Energy Efficiency",
      "Low Noise",
      "Smart Features (Wi-Fi, Auto Mode, etc.)"
    ]
  }
];

async function insertNudges() {
  await connectDB();
  try {
    // Insert each nudge as a separate document
    const result = await Nudge.insertMany(nudgesArray);
    console.log('Inserted nudges documents:', result);
  } catch (error) {
    console.error('Error inserting nudges:', error);
  } finally {
    process.exit();
  }
}

insertNudges(); 