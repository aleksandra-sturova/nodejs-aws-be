import AWS from 'aws-sdk';
import csvParser from 'csv-parser';
import { S3_BUCKET, REGION } from '../../constants';
import { RESPONSE } from '../../utils/response';

export const importFileParser = async (event) => {
  console.log('Entered import file parser lambda function, event: ', event);

  try {
    const { Records: records } = event;
    const s3 = new AWS.S3({ region: REGION });
    console.log('Records: ', records);

    await Promise.all(
      records.map(async (record) => {
        return new Promise((resolve, reject) => {
          const recordKey = record.s3.object.key;
          const parsedKey = record.s3.object.key.replace('uploaded', 'parsed');
          const params = {
            Bucket: S3_BUCKET,
            Key: recordKey,
          };

          const s3Stream = s3.getObject(params).createReadStream();
          console.log('Started read stream', s3Stream);

          s3Stream
            .pipe(csvParser())
            .on('data', (data) => console.info('Data: ', data))
            .on('error', (e) => {
              console.error('Error', e);
              reject();
            })
            .on('end', async () => {
              try {
                await s3.copyObject({
                    Bucket: S3_BUCKET,
                    CopySource: `${S3_BUCKET}/${recordKey}`,
                    Key: parsedKey,
                  })
                  .promise();

                console.info(`Copied ${recordKey} to ${parsedKey}`);

                await s3.deleteObject(params).promise();

                console.info(`Deleted ${recordKey}`);
                resolve();
              } catch (e) {
                console.log(e);
              }
            });
        });
      }),
    );
  } catch (e) {
    console.log(e);
    return RESPONSE._500();
  }
};
