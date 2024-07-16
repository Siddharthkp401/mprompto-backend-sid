const mongoose = require("mongoose");
const CompanyContentSchema = require("../models/companyContentSchema");
const Company = require("../models/companySchema");

const createCompanyDatabase = async (companyName) => {
  try {
    const lastCompany = await Company.findOne().sort({ _id: -1 }).exec();
    let nextNumber = 1;

    if (lastCompany && lastCompany.db_name) {
      const match = lastCompany.db_name.match(/^cp(\d+)_/);
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }

    const dbName = `cp${String(nextNumber).padStart(5, "0")}_${companyName
      .toLowerCase()
      .replace(/\s+/g, "_")}`;
    const dbUri = `mongodb://localhost:27017/${dbName}`;

    console.log(dbUri, "dbUri");

    // Create or reuse the connection
    const companyDb = mongoose.createConnection(
      dbUri,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      () => console.log(`CONNECTION INITIALIZED ${dbName}`)
    );

    const CompanyContent = companyDb.model(
      "CompanyContent",
      CompanyContentSchema
    );

    return { companyDb, dbName, CompanyContent };
  } catch (error) {
    console.error("Error in createCompanyDatabase:", error);
    throw error;
  }
};

module.exports = { createCompanyDatabase };
