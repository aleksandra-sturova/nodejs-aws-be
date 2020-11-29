import AWS from 'aws-sdk';
import fetch from 'node-fetch';
import { API, REGION } from '../../constants';
import { RESPONSE } from '../../utils/response';
// TODO: Refactor it - move to product service
const sendNotification = async (data = {}) => {
  try {
    const message = JSON.stringify(data);
    console.log('Entered send notification, message: ', message, 'count', data.count);

    const sns = new AWS.SNS({ region: REGION });

    await sns
      .publish({
        TopicArn: process.env.SNS_ARN,
        Subject: 'Created product',
        Message: message,
        MessageAttributes: {
          'count': {
            DataType: 'String',
            StringValue: data.count.toString(),
          },
        },
      })
      .promise();

    console.log('Successfully sent notification to SNS, SNS url: ', process.env.SNS_ARN, ', message: ', message);
  } catch (e) {
    console.log('Error while sending notification to SNS, error: ', e);
  }
};

export const catalogBatchProcess = async (event) => {
  console.log('Entered catalog batch process lambda function, event: ', event);

  try {
    const { Records: records } = event;
    console.log('Records: ', records);

    return await Promise.all(
      records.map(async (record) => {
        const productData = JSON.parse(record.body);
        console.log('Product data', productData);

        await fetch(API.PRODUCT_CREATE, {
          method: 'post',
          body: JSON.stringify(productData),
          headers: { 'Content-Type': 'application/json' },
        });

        console.log('Product created');

        await sendNotification(productData);

        return productData;
      }),
    );
  } catch (e) {
    console.log('Error while creating products', e);
    return RESPONSE._500();
  }
};
