import { SQS } from 'aws-sdk';
import LOG from 'src/utils/Logger';

/**
 * Send an message into SQS queue
 *
 * @param queueUrl
 *    SQS queue HTTP URL
 * @param messageBody
 *    Body string of the message
 * @param messageGroupId
 *    Group uuid
 * @returns
 *    SQS.SendMessageResult
 */
export const sendMessageQueue = async (queueUrl?: string, messageBody?: string, messageGroupId?: string): Promise<string> => {
  if (!queueUrl) {
    throw new Error('sendMessageQueue: queueUrl is empty!');
  }
  if (!messageBody) {
    throw new Error('sendMessageQueue: messageBody is empty!');
  }
  if (!messageGroupId) {
    throw new Error('sendMessageQueue: messageGroupId is empty!');
  }

  const request: SQS.SendMessageRequest = {
    MessageBody: messageBody,
    MessageGroupId: messageGroupId,
    QueueUrl: queueUrl,
  };

  LOG.trace('sendMessageToOAPQueue: Request:', request);
  const sendMessageResult: SQS.Types.SendMessageResult = await new SQS().sendMessage(request).promise();
  LOG.trace('sendMessageToOAPQueue: Response:', sendMessageResult);

  return `Send message to queue ${queueUrl} successfully`;
};
