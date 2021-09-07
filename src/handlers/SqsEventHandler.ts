import LOG from 'src/utils/Logger';
import { Context, SQSEvent, SQSRecord } from 'aws-lambda';
import { iSqsMessageXmlDataSource, iTrailer } from 'src/types/XmlDataSource';
import { isAllPromisesSuccess } from 'src/utils/ErrorHandlingUtils';
import { iOapAsset } from 'src/types/OapAsset';
import { buildOapAsset } from 'src/parser/OapAssetParser';
import { addOrUpdateOapAsset, queryOAPAssetItem, updateOapDataSourceStatus } from 'src/services/DynamoDBService';
import { isEqual } from 'lodash';
import { updateExistingOapAsset } from 'src/handlers/facade/SqsEventHandlerFacade';
import { DataSourceStatus } from 'src/utils/Enums';
import { sendMessageToIconikQueue } from 'src/handlers/helpers/SqsEventHandlerHelper';

/**
 * Process XmlDarasource sent from EventBridgeEventHandler sent to SQS in the previous step
 *
 * @param event
 *    SQS event
 * @param context
 *    Lambda execution context
 */
export const handle = async (event: SQSEvent, context: Context): Promise<string> => {
  LOG.trace('SqsEventhandler - received an event:', event);

  // process event records asynchronously
  const recordsProcessingResult = await Promise.allSettled(
    event.Records.map(async (sqsRecord: SQSRecord) => {
      const sqsMessage: iSqsMessageXmlDataSource = JSON.parse(sqsRecord.body);
      const { id, fileName, content }: iSqsMessageXmlDataSource = sqsMessage;

      const updateStatusResponse = await updateOapDataSourceStatus(id, DataSourceStatus.PROCESSING, 'XML file is parsing', context.functionName);
      LOG.trace(`SqsEventhandler - updateStatusResponse for Id: ${id}:`, updateStatusResponse);

      // collect oapAssets object if either it doesn't exist in DB or has meta data change to send to Iconik
      const assetsToSendToIconik: Array<iOapAsset> = [];

      // process trailers list asynchronously
      const trailersPromiseResponse = await Promise.allSettled(
        content.trailers.trailer.map(async (trailer: iTrailer) => {
          LOG.trace('SqsEventhandler - Trailer: ', trailer);

          const oapAsset: iOapAsset = buildOapAsset(trailer, sqsMessage, context.functionName);
          LOG.trace('SqsEventhandler - oapAsset: ', oapAsset);

          const assetFromDB: iOapAsset | null = await queryOAPAssetItem(trailer.id);
          if (!assetFromDB) {
            assetsToSendToIconik.push(oapAsset);
            // Add new oapAsset
            return await addOrUpdateOapAsset({ ...oapAsset, promoXMLId: id, promoXMLName: fileName }, context.functionName);
          }

          // Update existing oapAsset if metadata changed
          if (!isEqual(oapAsset.xmlMetadata.data, assetFromDB.xmlMetadata.data)) {
            LOG.trace(`SqsEventhandler - trailer ${oapAsset.trailerId} metadata changed - updating existing record from DB `);
            const mergedAsset = await updateExistingOapAsset(oapAsset, assetFromDB, context.functionName);
            assetsToSendToIconik.push(mergedAsset);
            return `Updated trailer ${mergedAsset.trailerId} successfully`;
          } else {
            LOG.trace(`SqsEventhandler - trailer ${oapAsset.trailerId} no metadata changed `);
            return `trailer ${oapAsset.trailerId} no metadata changed`;
          }
        })
      );

      LOG.trace(`SqsEventHandler - Process trailers for xmlDataSource: ${id} responses:`, trailersPromiseResponse);

      // cheking async responses
      if (!isAllPromisesSuccess(trailersPromiseResponse)) {
        LOG.error('Error occured in when processing Sqs Record trailers:', sqsRecord, trailersPromiseResponse);
        await updateOapDataSourceStatus(id, DataSourceStatus.FAILED, 'Server processing error in 1 of the trailer items', context.functionName);
        throw new Error(`Error occured in when processing Sqs Record: messageId: ${sqsRecord.messageId} - xmlDataSource Id: ${id}`);
      }

      if (assetsToSendToIconik.length) {
        const iconikMessageResponse = await sendMessageToIconikQueue(assetsToSendToIconik, id);
        LOG.trace(`SqsEventHandler - iconikMessageResponse`, iconikMessageResponse);
      }
      await updateOapDataSourceStatus(id, DataSourceStatus.FINISHED, 'XML file is processed', context.functionName);
      return `Process SQS message Id: ${sqsRecord.messageId}, xmlDataSource Id: ${id} successfully`;
    })
  );

  // checking event records processing responses
  if (!isAllPromisesSuccess(recordsProcessingResult)) {
    LOG.error('SqsEventHandler - one of the records encountered error. Event:', event, 'All result:', recordsProcessingResult);
    return 'Failed';
  }
  LOG.trace(`SqsEventHandler - process SQS records async response:`, recordsProcessingResult);
  return 'Successful';
};
