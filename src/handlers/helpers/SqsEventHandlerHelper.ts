import { sendMessageQueue } from 'src/services/SqsService';
import { iOapAsset } from 'src/types/OapAsset';
import LOG from 'src/utils/Logger';
/**
 * Send filecontent as a message into SQS to be processed in later steps
 *
 * @param xmlDataSource
 *    File XML content iXmlDataSource
 * @param fileDisplayName
 *    File name
 * @param id
 *    uuid
 * @returns
 *
 */
export const sendMessageToIconikQueue = (oapAssets: Array<iOapAsset>, id: string): Promise<string> => {
  if (!process.env.OAP_ICONIK_QUEUE_URL) {
    LOG.error('Configuration error! process.env.OAP_ICONIK_QUEUE_URL is empty.');
    throw new Error('Configuration error! process.env.OAP_ICONIK_QUEUE_URL is empty.');
  }
  LOG.trace(`Sending message to queue: ${process.env.OAP_ICONIK_QUEUE_URL} with message body. `, oapAssets);
  return sendMessageQueue(process.env.OAP_ICONIK_QUEUE_URL, JSON.stringify(oapAssets), id);
};
