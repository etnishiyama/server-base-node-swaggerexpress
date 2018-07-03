/*
const AWS = require('aws-sdk');

AWS.config.setPromisesDependency(global.Promise);
const fileType = require('file-type');

import env from '../../config/environment';

const BASE_IMAGE_URL = env.aws.baseImageUrl;
const BASE_64_STRING = 'base64,';

const config = new AWS.Config({
  accessKeyId: env.aws.accountKey,
  secretAccessKey: env.aws.securityKey,
  region: env.aws.region,
});

AWS.config.update(config);

const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

const imageTypes = [
  'image/gif',
  'image/jpg',
  'image/jpeg',
  'image/png',
];

function uploadImageToS3Bucket(path, image) {
  console.log(`uploadImageToS3Bucket: ${path}`);
  return new Promise((resolve, reject) => {
    if (typeof image !== 'string') {
      reject();
    }

    const base64StringPosition = image.indexOf(BASE_64_STRING);
    let newImage = image;

    if (base64StringPosition) {
      newImage = image.substring(base64StringPosition + BASE_64_STRING.length, image.length);
    }

    const fileBuffer = Buffer.from(newImage, 'base64');
    const fileTypeInfo = fileType(fileBuffer);

    // validate image is on right type and size
    if (fileBuffer.length > 0 && fileBuffer.length < 5000000 &&
      imageTypes.includes(fileTypeInfo.mime)) {
      // upload it to s3 with unix timestamp as a file name
      const fileName = `${Math.floor(new Date().getTime())}.${fileTypeInfo.ext}`;

      const bucket = env.aws.s3BucketName;
      const params = {
        Body: fileBuffer,
        Key: `${path}/${fileName}`,
        Bucket: bucket,
        ContentEncoding: 'base64',
        ContentType: `image/${fileTypeInfo.mime}`,
      };

      s3.putObject(params, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(`${BASE_IMAGE_URL}/${params.Key}`);
        }
      });
    } else {
      resolve();
    }
  });
}

export default {
  uploadImageToS3Bucket,
};
*/
