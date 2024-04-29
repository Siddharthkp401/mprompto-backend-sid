import multer from 'multer';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';
import config from '../config/config.js';

// AWS.config.update({
//   secretAccessKey: config.s3Bucket.secret_access_key,
//   accessKeyId: config.s3Bucket.bucket_access_key,
//   region: config.s3Bucket.bucket_region,
// });

// const s3 = new AWS.S3();

// const upFile = multer({
//   storage: multerS3({
//     s3,
//     bucket: config.s3Bucket.bucket,
//     acl: 'public-read',
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     key: (req, file, cb) => {
//       cb(null, `images/${file.originalname}`);
//     },
//   }),
// });


const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null,( 'src/temp'));
  },
  filename: function(req, file, cb) {
    req.file = file.fieldname + '-' + file.originalname.replace(/[^a-zA-Z0-9.]+/g, '');
    cb(null, req.file);
  },
});

const upFile = multer({
  storage: storage,
});


const uploadFile = upFile.fields([
  {
    name: 'file_content',
  },
]);

export default uploadFile;
