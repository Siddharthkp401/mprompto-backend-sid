import httpStatus from 'http-status';
import { companyService, fileContentService, urlServices } from '../services/index.js';
import catchAsync from '../utils/catchAsync.js';
import companyContentService from '../services/companyContent.service.js';

// post company content (external url / file / F&Q / review & rating)
const postCompanyContent = catchAsync(async (req, res) => {
    const reqData = req.body;
    const userCompanyId = await companyService.fetchUserCompany(req.user._id);
    const companyContentObj = {
        company_id: userCompanyId._id,
    };
    let resultData = {}

    //Extxernal Url
    if (Number(reqData.content_type) === 1) {
        companyContentObj.content_type = 1
        const companyContent = await companyContentService.uploadCompanyContent(companyContentObj);

        reqData.company_content_id = companyContent._id;

        const urlData = await urlServices.postUrlData(reqData);

        if (!urlData) {
            res.status(httpStatus.BAD_GATEWAY).send({ success: false, message: 'Post Content url failed!', data: [] });
        }
          
        resultData.language = companyContent.language,
        resultData.content_state = companyContent.content_state,
        resultData.content_audience = companyContent.content_audience,
        resultData.time_used_in_answer = companyContent.time_used_in_answer,
        resultData.resolved = companyContent.resolved,
        resultData.company_id = companyContent.company_id,
        resultData.content_type = companyContent.content_type
        resultData.content_url = urlData.content_url,
        resultData.content_id = urlData._id

        res.status(httpStatus.OK).send({ success: false, message: 'Post Content url successfull!', data: resultData });
    }

    // file 
    if (Number(reqData.content_type) === 2) {
        companyContentObj.content_type = 2
        const companyContent = await companyContentService.uploadCompanyContent(companyContentObj);

        reqData.company_content_id = companyContent._id;

        const storeData = await fileContentService.uploadFile(reqData, req.file);
        
        if (storeData) {
            
            
            resultData.language = companyContent.language,
            resultData.content_state = companyContent.content_state,
            resultData.content_audience = companyContent.content_audience,
            resultData.time_used_in_answer = companyContent.time_used_in_answer,
            resultData.resolved = companyContent.resolved,
            resultData.company_id = companyContent.company_id,
            resultData.content_type = companyContent.content_type
            resultData.filepath = storeData.filepath,
            resultData.content_id = storeData._id
            
            res.status(httpStatus.OK).send({ success: true, message: 'File uploaded successfully!', data: resultData });
        }
    }
    if (Number(reqData.content_type) === 3) {
        companyContentObj.content_type = 3

    }
    if (Number(reqData.content_type) === 4) {
        companyContentObj.content_type = 4

    }

})

const getCompanyContent = catchAsync(async (req, res) => {
    //fetch usercompany id
    const userCompany = await companyService.fetchUserCompany(req.user._id);

    // const companyContentId = await companyContentService

    const companyContentData = await companyContentService.getAllCompanyContent(userCompany._id)
    res.send(companyContentData)


})



export default { postCompanyContent, getCompanyContent }