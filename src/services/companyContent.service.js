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

const getAllCompanyContent = async (companyId, filter, options) => {
  const urlContentData = await CompanyContent.aggregate(
    [
      {
        '$match': {
          'company_id': companyId
        }
      }, {
        '$lookup': {
          'from': 'urlcontents',
          'localField': '_id',
          'foreignField': 'company_content_id',
          'as': 'urlContent'
        }
      }, {
        '$unwind': {
          'path': '$urlContent'
        }
      }, {
        '$project': {
          'urlContent.content_url': 1,
          'language': 1,
          'content_type': 1,
          'content_state': 1,
          'content_audience': 1,
          'time_used_in_answer': 1,
          'resolved': 1
        }
      }
    ])
  const fileContentData = await CompanyContent.aggregate([
    {
      '$match': {
        'company_id': companyId
      }
    }, {
      '$lookup': {
        'from': 'filecontents',
        'localField': '_id',
        'foreignField': 'company_content_id',
        'as': 'fileContentData'
      }
    }, {
      '$unwind': {
        'path': '$fileContentData'
      }
    }
  ])

  let resultData = []
  urlContentData.map((cd) => {
    let obj = {};

    obj.content_id = cd._id,
      obj.language = cd.language,
      obj.content_state = cd.content_state,
      obj.content_audience = cd.content_audience,
      obj.time_used_in_answer = cd.time_used_in_answer,
      obj.resolved = cd.resolved,
      obj.content_type = cd.content_type,
      obj.content = cd.urlContent?.content_url,
      obj.title = cd.title,

      resultData.push(obj)
  })

  fileContentData.map((cd) => {
    let obj = {};

    obj.content_id = cd._id,
      obj.language = cd.language,
      obj.content_state = cd.content_state,
      obj.content_audience = cd.content_audience,
      obj.time_used_in_answer = cd.time_used_in_answer,
      obj.resolved = cd.resolved,
      obj.content_type = cd.content_type,
      obj.content = cd.fileContentData?.filepath,
      obj.title = cd.title,

      resultData.push(obj)
  })

  return await CompanyContent.paginate(filter, options, resultData)
}


export default { uploadCompanyContent, getAllCompanyContent };
