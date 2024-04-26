import mongoose from 'mongoose';
import { CompanyContent, FileContent, UrlContent } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import companyService from './company.service.js';
import urlContentServices from './urlContent.services.js';

const uploadCompanyContent = async (body) => {
  const postcontentData = await CompanyContent.create(body);

  if (!postcontentData) {
    throw new ApiError('Upload content failed!');
  }
  return postcontentData;
};

const getAllCompanyContent = async (companyId) => {
  const contentData = await CompanyContent.aggregate([
  {
    '$match': {
      'company_id':  companyId
    }
  }, {
    '$lookup': {
      'from': 'urlcontents', 
      'localField': '_id', 
      'foreignField': 'company_content_id', 
      'as': 'content'
    }
  }, {
    '$unwind': {
      'path': '$content'
    }
  }, {
    '$project': {
      'content.content_url': 1, 
      'content.company_content_id': 1, 
      'content._id': 1,   
      'language': 1, 
      'content_type': 1, 
      'content_state': 1, 
      'content_audience': 1, 
      'time_used_in_answer': 1, 
      'resolved': 1
    }
  }
])

  // const contentData = await CompanyContent.find({ company_id: companyId })

  // const content = await UrlContent.find({ company_content_id: contentData._id })

  return contentData;
}


export default { uploadCompanyContent, getAllCompanyContent };
