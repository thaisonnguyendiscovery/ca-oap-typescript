import { S3 } from 'aws-sdk';
import LOG from 'src/utils/Logger';

/**
 * Read file string content
 *
 * @param bucketName
 * @param fileKey
 * @param s3BucketCustomFolder
 *
 * @returns string of file content
 */
export const readFileS3 = async (bucketName: string, fileKey: string): Promise<string> => {
  const params: S3.Types.GetObjectRequest = {
    Bucket: bucketName,
    Key: fileKey,
  };

  LOG.trace('readFile request:', params);

  const s3 = new S3({ region: process.env.AWS_REGION });
  const data = await s3.getObject(params).promise();
  const result = data.Body?.toString('utf-8') || '';
  LOG.trace('Read file result:', params, result.replace(/(\r\n|\n|\r)/gm, '').trim());
  return result;

  /**
   * TODO: confirm on ISO-8859-1 decode
   */
  // const buffer = decode(Buffer.from(data.Body as Buffer), 'ISO-8859-1');
  // return encode(buffer, 'utf8').toString();
};

/**
 * Copy file to another location
 *
 * @param bucketName
 * @param origin
 * @param destination
 * @param fileName
 *
 * @returns Promise<S3.CopyObjectOutput>
 */
export const copyFileS3 = async (bucketName: string, origin: string, destination: string, fileName: string): Promise<S3.CopyObjectOutput> => {
  const params = {
    Bucket: bucketName,
    CopySource: `${bucketName}/${origin}/${fileName}`,
    Key: `${destination}/${fileName}`,
  };

  const s3 = new S3({ region: process.env.AWS_REGION });
  const copyObjResponse: S3.CopyObjectOutput = await s3.copyObject(params).promise();
  LOG.trace('S3 Copy File: -', params, copyObjResponse);
  return copyObjResponse;
};

/**
 * Delete file from S3
 *
 * @param bucketName
 * @param origin
 * @param fileName
 *
 * @returns Promise<S3.DeleteObjectOutput>
 */
export const deleteFileS3 = async (bucketName: string, origin: string, fileName: string): Promise<S3.DeleteObjectOutput> => {
  const params = {
    Bucket: bucketName,
    Key: `${origin}/${fileName}`,
  };

  const s3 = new S3({ region: process.env.AWS_REGION });
  const deleteResponse: S3.DeleteObjectOutput = await s3.deleteObject(params).promise();
  LOG.trace('S3 Delete File: -', params, deleteResponse);
  return deleteResponse;
};

/**
 * move file to new location by copying then delete
 *
 * @param bucketName
 * @param origin
 * @param destination
 * @param fileName
 */
export const moveFileS3 = async (bucketName?: string, origin?: string, destination?: string, fileName?: string): Promise<boolean> => {
  if (!bucketName) {
    throw new Error('moveFile - bucketName is empty!');
  }
  if (!origin) {
    throw new Error('moveFile - origin is empty!');
  }
  if (!destination) {
    throw new Error('moveFile - destination is empty!');
  }
  if (!fileName) {
    throw new Error('moveFile - bucketName is empty!');
  }

  const copyResponse = await copyFileS3(bucketName, origin, destination, fileName);
  const deleteResponse = await deleteFileS3(bucketName, origin, fileName);
  LOG.trace('moveFile response: -', copyResponse, deleteResponse);
  return true;
};
