import { Company } from '../models/index.js';

/**
 * Create a user in TempUser table
 * @param {Object} companyBody
 * @returns {Promise<Company>}
 */
const createCompany = async (companyBody) => {
  return Company.create(companyBody);
};

const fetchUserCompany = async (userId) => {
  return Company.findOne({ user_id: userId });
};

const getCompanyById = async (companyId) => {
  return Company.findOne({ _id: companyId });
  
}

export default { createCompany, fetchUserCompany , getCompanyById};
