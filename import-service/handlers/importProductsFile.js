import AWS from 'aws-sdk';
import { S3_BUCKET, REGION } from '../../constants';
import { RESPONSE } from '../../utils/response';

export const importProductsFile = async (event) => {
  console.log('Entered import products file lambda function, event: ', event);

  try {
    const { name } = event.queryStringParameters || {};
    console.log('Query String Parameters: ', event.queryStringParameters);
    console.log('File name ', name);

    if (!name) {
      return RESPONSE._400(`Invalid name ${name}! Please, specify file name.`);
    }

    const s3 = new AWS.S3({ region: REGION });

    const params = {
      Bucket: S3_BUCKET,
      Key: `uploaded/${name}`,
      ContentType: 'text/csv',
    };

    const signedUrl = await s3.getSignedUrlPromise('putObject', params);

    console.log('Signed url: ', signedUrl);

    return RESPONSE._200(signedUrl);
  } catch (e) {
    console.log(e);
    return RESPONSE._500();
  }
};
