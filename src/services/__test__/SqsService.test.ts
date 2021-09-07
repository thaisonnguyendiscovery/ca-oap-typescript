import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';
import { sendMessageQueue } from 'src/services/SqsService';

describe('SqsService Test', () => {
  it('should sendMessageQueue', async () => {
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock('SQS', 'sendMessage', (_params, callback) => {
      callback(null, { SendMessageResult: 'ok' });
    });

    await expect(sendMessageQueue('', '', '')).rejects.toThrow(Error);
    await expect(sendMessageQueue('queueUrl', '', '')).rejects.toThrow(Error);
    await expect(sendMessageQueue('queueUrl', 'body', '')).rejects.toThrow(Error);

    const response = await sendMessageQueue('queueUrl', 'body', 'groupId');
    expect(response).toEqual('Send message to queue queueUrl successfully');

    AWSMock.restore('SQS');
  });
});
