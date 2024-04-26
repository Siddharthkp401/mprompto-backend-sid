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

    //Extxernal Url
    if (reqData.content_type === 1) {
        companyContentObj.content_type = 1
        const companyContent = await companyContentService.uploadCompanyContent(companyContentObj);

        reqData.company_content_id = companyContent._id;

        const urlData = await urlServices.postUrlData(reqData);

        if (!urlData) {
            res.status(httpStatus.BAD_GATEWAY).send({ success: false, message: 'Post Content url failed!', data: [] });
        }

        res.status(httpStatus.OK).send({ success: false, message: 'Post Content url successfull!', data: urlData });
    }

    // file 
    if (reqData.content_type === 2) {
        companyContentObj.content_type = 2
        const companyContent = await companyContentService.uploadCompanyContent(companyContentObj);

        reqData.company_content_id = companyContent._id;

        const storeData = await fileContentService.uploadFile(req.body, req.files[0]);

        if (storeData) {
            res.status(httpStatus.OK).send({ success: true, message: 'File uploaded successfully!' });
        }
    }
    if (reqData.content_type === 3) {
        companyContentObj.content_type = 3

    }
    if (reqData.content_type === 4) {
        companyContentObj.content_type = 4

    }

})

const getCompanyContent = catchAsync(async (req, res) => {
//fetch usercompany id
    const userCompany = await companyService.fetchUserCompany(req.user._id);

    // const companyContentId = await companyContentService

    const companyContentData = await companyContentService.getAllCompanyContent(userCompany._id)
    console.log('companyContentData :', companyContentData);
    res.send(companyContentData)


})



export default { postCompanyContent , getCompanyContent}