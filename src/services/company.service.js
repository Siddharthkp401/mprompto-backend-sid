const { Company } = require('../models')


/**
 * Create a user in TempUser table
 * @param {Object} companyBody
 * @returns {Promise<Company>}
 */
const createCompany = async (companyBody) => {
    return await Company.create(companyBody)
}

module.exports = {createCompany}