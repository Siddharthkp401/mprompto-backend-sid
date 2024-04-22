import { Company } from '../models/index.js'


/**
 * Create a user in TempUser table
 * @param {Object} companyBody
 * @returns {Promise<Company>}
 */
const createCompany = async (companyBody) => {
    return await Company.create(companyBody)
}

export const companyService = { createCompany }