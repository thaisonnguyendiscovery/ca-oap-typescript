import { Context, EventBridgeEvent } from 'aws-lambda';
import LOG from 'src/utils/Logger';
import { handleInvalidFileExtension, handleInvalidFileSchema, readDatasourceFromS3, processOapXmlRecord } from 'src/handlers/facade/EventBridgeHandlerFacade';
import { validateSchema } from 'src/validators/OapXmlValidator';
import { safely } from 'src/utils/ErrorHandlingUtils';
import { iXmlDataSource } from 'src/types/XmlDataSource';

export interface iBridgeParaneters {
  bucketName: string;
  key: string;
}

export interface iEventBridgeDetail {
  eventTime: string;
  eventType: string;
  requestParameters: iBridgeParaneters;
}
/**
 * Handler function for event bridge event from S3 when uploa xml file to targeted folder
 *
 * @param event
 *    EventBridgeEvent from AWS
 * @param context
 *    Lambda execution content
 * @returns
 *    any
 */
export const handle = async (event: EventBridgeEvent<'iEventBridgeDetail', iEventBridgeDetail>, context: Context): Promise<any> => {
  LOG.trace('EventBridgeEventHandler handler - received event detail:', event.detail);

  const params: iBridgeParaneters = event.detail.requestParameters;
  const { key } = params;

  if (!key.endsWith('.xml')) {
    LOG.error(`EventBridgeEventHandler - Invalid file extension:`, event.detail);
    return await handleInvalidFileExtension(key, context.functionName, event.time);
  }

  const xmlDataSource: iXmlDataSource | null | undefined = await safely(readDatasourceFromS3(params));
  if (!xmlDataSource) {
    LOG.error('EventBridgeEventHandler - Error when reading file from s3:', params);
    return;
  }

  const schemaValidationErrors = validateSchema(xmlDataSource);
  if (schemaValidationErrors?.length) {
    LOG.error('EventBridgeEventHandler - Invalid file schema:', event.detail, schemaValidationErrors);
    return await handleInvalidFileSchema(params, context.functionName, event.time, schemaValidationErrors);
  }

  return await processOapXmlRecord(params, xmlDataSource, context.functionName, event.time);
};
