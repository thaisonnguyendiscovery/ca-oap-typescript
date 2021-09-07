import { v1 as uuidv1 } from 'uuid';
import path from 'path';
import { sendOapMessageQueue, writeInvalidOapXmlSchemaToDB, writeSuccessOapXmlToDB, writeInvalidOapXmlExtensionToDB } from 'src/handlers/helpers/EventBridgeHandlerHelper';
import { OAP_ASSET_CREATION_ERROR_HEADER, OAP_ASSET_CREATION_SUCCESS_HEADER } from 'src/utils/Constants';
import { sendSlackMessage } from 'src/services/NotificationService';
import { moveFileS3, readFileS3 } from 'src/services/S3Service';
import { DataSourceValidationComment } from 'src/utils/Enums';
import { isAllPromisesSuccess } from 'src/utils/ErrorHandlingUtils';
import { iBridgeParaneters } from 'src/handlers/EventBridgeEventHandler';
import LOG from 'src/utils/Logger';
import { iXmlDataSource } from 'src/types/XmlDataSource';
import { parseStringPromise } from 'xml2js';
import { flattenObject } from 'src/utils/CommonUtils';

/**
 * Read and parse xml data source object from S3
 *
 * @param params
 *    S3 file info
 * @returns
 *    iXmlDataSource object
 */
export const readDatasourceFromS3 = async (params: iBridgeParaneters): Promise<iXmlDataSource | undefined> => {
  const { bucketName, key } = params;
  const fileContent = await readFileS3(bucketName, key);
  const xml2js = await parseStringPromise(fileContent);
  LOG.trace('readDatasourceFromS3 - xmlDataSource:', xml2js);
  if (!xml2js) {
    LOG.error('readDatasourceFromS3 parse tring to JS object Error:', fileContent);
    return;
  }

  const xmlDataSource: iXmlDataSource = flattenObject(xml2js);
  LOG.trace('readDatasourceFromS3 - xmlDataSource result:', xmlDataSource);
  return xmlDataSource;
};

/**
 * Handle the case file extension is invalid, either missing file extension or file not in xml format.
 *
 * @param fileS3Key
 * @param functionName
 * @param time
 * @returns
 *      Boolean value of all actions success or not
 */
export const handleInvalidFileExtension = async (fileS3Key: string, functionName: string, time: string): Promise<boolean> => {
  const fileDisplayName: string = path.basename(fileS3Key);
  const errorMessage = `${DataSourceValidationComment.INVALID_FILE_EXTENSION} - ${fileDisplayName.includes('.') ? 'Wrong file extension' : 'Missing file extension'}`;
  const slackMessageBody = `Source: '${fileDisplayName}' \n>Error Message: ${errorMessage}`;

  const updateDBPromise = writeInvalidOapXmlExtensionToDB(fileS3Key, functionName);
  const sendSlackMessagePromise = sendSlackMessage(OAP_ASSET_CREATION_ERROR_HEADER, slackMessageBody, time);

  const promiseResults: Array<globalThis.PromiseSettledResult<any>> = await Promise.allSettled([updateDBPromise, sendSlackMessagePromise]);
  LOG.trace('handleInvalidFileExtension Promise results:', promiseResults);

  if (!isAllPromisesSuccess(promiseResults)) {
    LOG.error('handleInvalidFileExtension:', promiseResults);
    return false;
  }
  return true;
};

/**
 *  * In case file content is invalid with the given schema:
 *  - Add 1 recored with error message into DynamoDB
 *  - Move file into an archive folder
 *  - Send error Slack mesage
 *
 * @param params
 * @param functionName
 * @param time
 * @param schemaErrors
 * @returns
 *      Boolean value of all actions success or not
 */
export const handleInvalidFileSchema = async (params: iBridgeParaneters, functionName: string, time: string, schemaErrors: Array<any>): Promise<boolean> => {
  const { bucketName, key }: iBridgeParaneters = params;
  const fileDisplayName: string = path.basename(key);

  const errorMessage = `${DataSourceValidationComment.INVALID_XML} - ${JSON.stringify(schemaErrors)}`;
  const slackMessageBody = `Source: '${fileDisplayName}' \n>Error Message: ${errorMessage}`;

  const dynamoUpdatePromise = writeInvalidOapXmlSchemaToDB(params, functionName, schemaErrors);
  const moveFilePromise = moveFileS3(bucketName, path.dirname(key), process.env.FAILED_FOLDER_PATH, fileDisplayName);
  const sendSlackMessahePromise = sendSlackMessage(OAP_ASSET_CREATION_ERROR_HEADER, slackMessageBody, time);

  const promiseResults: Array<globalThis.PromiseSettledResult<any>> = await Promise.allSettled([dynamoUpdatePromise, moveFilePromise, sendSlackMessahePromise]);
  LOG.trace('handleInvalidFileSchema Promise results:', promiseResults);

  if (!isAllPromisesSuccess(promiseResults)) {
    LOG.error('handleInvalidFileSchema:', promiseResults);
    return false;
  }
  return true;
};

/**
 * If the file is valid
 *  - Send a message into SQS queue to proceed further in later steps
 *  - Write a record to DynamoDB
 *  - Mode file in S3 to archive
 *  - Send Slack sucess notification
 *
 * @param params
 *      params from S3 event
 * @param xmlDataSource
 *      iXmlDataSource
 * @param functionName
 *      Lambda function name
 * @param time
 *      Lambda triggered time
 * @returns
 *      Boolean value of all actions success or not
 */
export const processOapXmlRecord = async (params: iBridgeParaneters, xmlDataSource: iXmlDataSource, functionName: string, time: string): Promise<boolean> => {
  const { bucketName, key }: iBridgeParaneters = params;
  const fileDisplayName: string = path.basename(key);
  const id = uuidv1();

  const queuePromise = sendOapMessageQueue(xmlDataSource, fileDisplayName, id);
  const updateDBPromise = writeSuccessOapXmlToDB(xmlDataSource, key, functionName, id);
  const moveFilePromise = moveFileS3(bucketName, path.dirname(key), process.env.ARCHIVE_FOLDER_PATH, fileDisplayName);
  const sendSlackMessagePromise = sendSlackMessage(OAP_ASSET_CREATION_SUCCESS_HEADER, '_ ' + fileDisplayName + '_', time);

  const promiseResults: Array<globalThis.PromiseSettledResult<any>> = await Promise.allSettled([queuePromise, updateDBPromise, moveFilePromise, sendSlackMessagePromise]);
  LOG.trace('processOapXmlRecord Promise results:', promiseResults);

  if (!isAllPromisesSuccess(promiseResults)) {
    LOG.error('processOapXmlRecord:', promiseResults);
    return false;
  }
  return true;
};
