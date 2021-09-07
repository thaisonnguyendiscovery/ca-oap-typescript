import AWSMock from 'aws-sdk-mock';
import { readFileS3, copyFileS3, deleteFileS3, moveFileS3 } from 'src/services/S3Service';
import AWS from 'aws-sdk';

describe('S3Service test', () => {
  it('should readFileS3', async () => {
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock('S3', 'getObject', (_params, callback) => {
      callback(null, { Body: Buffer.from('dummy') });
    });

    const response = await readFileS3('bucketName', 'fileKey');
    expect(response).toBe('dummy');

    AWSMock.restore('S3');
  });

  it('should readFileS3 with empty body', async () => {
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock('S3', 'getObject', (_params, callback) => {
      callback(null, { Body: Buffer.from('') });
    });

    const response = await readFileS3('bucketName', 'fileKey');
    expect(response).toBe('');

    AWSMock.restore('S3');
  });

  it('should copyFileS3', async () => {
    AWSMock.setSDKInstance(AWS);

    AWSMock.mock('S3', 'copyObject', (_params, callback) => {
      callback(null, { CopyObjectResult: 'ok' });
    });

    const response = await copyFileS3('bucketName', 'from', 'to', 'name');
    expect(response).toEqual({ CopyObjectResult: 'ok' });

    AWSMock.restore('S3');
  });

  it('should deleteFileS3', async () => {
    AWSMock.setSDKInstance(AWS);

    AWSMock.mock('S3', 'deleteObject', (_params, callback) => {
      callback(null, { DeleteObjectResult: 'ok' });
    });

    const response = await deleteFileS3('bucketName', 'origin', 'name');
    expect(response).toEqual({ DeleteObjectResult: 'ok' });

    AWSMock.restore('S3');
  });

  it('should moveFileS3', async () => {
    AWSMock.setSDKInstance(AWS);

    AWSMock.mock('S3', 'copyObject', (_params, callback) => {
      callback(null, { CopyObjectResult: 'ok' });
    });
    AWSMock.mock('S3', 'deleteObject', (_params, callback) => {
      callback(null, { DeleteObjectResult: 'ok' });
    });

    await expect(moveFileS3('', '', '', '')).rejects.toThrow(Error);
    await expect(moveFileS3('bucketName', '', '', '')).rejects.toThrow(Error);
    await expect(moveFileS3('bucketName', 'from', '', '')).rejects.toThrow(Error);
    await expect(moveFileS3('bucketName', 'from', 'to', '')).rejects.toThrow(Error);

    const response = await moveFileS3('bucketName', 'from', 'to', 'name');
    expect(response).toBeTruthy();

    AWSMock.restore('S3');
  });
});
