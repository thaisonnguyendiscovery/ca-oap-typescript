import { translateToLocale } from 'src/i18n/i18n';
import { iBridgeParaneters } from 'src/handlers/EventBridgeEventHandler';
import { addOrUpdateOapDataSource } from 'src/services/DynamoDBService';
import { iOapDataSource } from 'src/types/OapDataSource';
import { DataSourceStatus, DataSourceValidationComment, ErrorCode } from 'src/utils/Enums';
import { v1 as uuidv1 } from 'uuid';
import { sendMessageQueue } from 'src/services/SqsService';
import path from 'path';
import { iSqsMessageXmlDataSource, iXmlDataSource } from 'src/types/XmlDataSource';

/**
 * When the xml file has invalid extension, write a record in DB to mark this error
 *
 * @param fileS3Key
 *    file key from S3
 * @param functionName
 *    lambda function name
 * @returns
 *    Update DynamoDB response
 */
export const writeInvalidOapXmlExtensionToDB = (fileS3Key: string, functionName: string): Promise<string> => {
  const fileDisplayName: string = path.basename(fileS3Key);
  const country = fileDisplayName?.split('_')[2];

  const message = `${DataSourceValidationComment.INVALID_FILE_EXTENSION} - ${fileDisplayName.includes('.') ? 'Wrong file extension' : 'Missing file extension'}`;
  const dataSourceEntry: iOapDataSource = {
    ID: uuidv1(),
    dataFileName: fileDisplayName,
    filePath: fileS3Key,
    dataSourceStatus: DataSourceStatus.FAILED,
    createdBy: functionName,
    modifiedBy: functionName,
    comments: DataSourceValidationComment.INVALID_FILE_EXTENSION,
    country,
    errors: {
      code: ErrorCode.INVALID_XML_EXTENSION_ERR,
      message,
    },
  };
  return addOrUpdateOapDataSource(dataSourceEntry, functionName);
};

/**
 * If the xml has invalid file content, write a record into DB to mark this error
 *
 * @param params
 *    Event Brigde parameters
 * @param functionName
 *    Lambda function name
 * @param schemaErrors
 *    Schema validation errors
 * @returns
 *    DynamoDB update response
 */
export const writeInvalidOapXmlSchemaToDB = (params: iBridgeParaneters, functionName: string, schemaErrors: Array<any>): Promise<string> => {
  const { key }: iBridgeParaneters = params;
  const fileDisplayName: string = path.basename(key);
  const country = fileDisplayName?.split('_')[2];

  const message = `${DataSourceValidationComment.INVALID_XML} - ${JSON.stringify(schemaErrors)}`;
  const dataSourceEntry: iOapDataSource = {
    ID: uuidv1(),
    dataFileName: fileDisplayName,
    filePath: key,
    dataSourceStatus: DataSourceStatus.FAILED,
    createdBy: functionName,
    modifiedBy: functionName,
    comments: DataSourceValidationComment.INVALID_XML,
    country,
    errors: {
      code: ErrorCode.INVALID_XML_SCHEMA_ERR,
      message,
    },
  };
  return addOrUpdateOapDataSource(dataSourceEntry, functionName);
};

/**
 * When the xml file has valid extension and content, write a success record into DB
 *
 * @param xmlDataSource
 *    Data soure JS object parsed from XML file
 * @param s3Key
 *    File key in S3
 * @param functionName
 *    Lambda function name
 * @param id
 *    uuid
 * @returns
 *    DynamoDB update response
 */
export const writeSuccessOapXmlToDB = (xmlDataSource: iXmlDataSource, s3Key: string, functionName: string, id: string): Promise<string> => {
  const userName = xmlDataSource.trailers.username;
  const country = translateToLocale('countryName', xmlDataSource.trailers.countryCode);

  const dataSourceEntry: iOapDataSource = {
    ID: id,
    dataFileName: path.basename(s3Key),
    filePath: s3Key,
    dataSourceStatus: DataSourceStatus.PASSED,
    createdBy: functionName,
    modifiedBy: functionName,
    comments: DataSourceValidationComment.SUCCESS,
    errors: {},
    country,
    userName,
  };
  return addOrUpdateOapDataSource(dataSourceEntry, functionName);
};

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
export const sendOapMessageQueue = (xmlDataSource: iXmlDataSource, fileDisplayName: string, id: string): Promise<string> => {
  const payload: iSqsMessageXmlDataSource = {
    id,
    fileName: fileDisplayName,
    content: xmlDataSource,
  };

  return sendMessageQueue(process.env.OAP_QUEUE_URL, JSON.stringify(payload), id);
};
