import { iOapAsset } from './../types/OapAsset';
import AWS, { DynamoDB } from 'aws-sdk';
import LOG from 'src/utils/Logger';
import { iOapDataSource } from 'src/types/OapDataSource';
import { DataSourceStatus } from 'src/utils/Enums';

AWS.config.update({ region: process.env.AWS_REGION });

/**
 * Add new Oap DataSource entry if not exist or update an existing entry
 *
 * @param oapDataSource
 *
 * @returns
 *    successful string message or throw error to caller to handle if any
 */
export const addOrUpdateOapDataSource = async (oapDataSource: iOapDataSource, functionName: string): Promise<string> => {
  LOG.trace('DynamoDBService - addOrUpdateOapDataSource: Request:', oapDataSource);

  if (!process.env.OAP_DATASOURCE_TABLE) {
    LOG.error('Configuration Error: process.env.OAP_DATASOURCE_TABLE is empty!');
    throw new Error('Configuration Error: process.env.OAP_DATASOURCE_TABLE is empty!');
  }

  const now = new Date().toISOString();
  const item: DynamoDB.DocumentClient.PutItemInput = {
    TableName: process.env.OAP_DATASOURCE_TABLE,
    Item: { ...oapDataSource, dataSourceName: process.env.DATA_SOURCE, createdAt: oapDataSource.createdAt || now, createdBy: oapDataSource.createdBy || functionName, modifiedAt: now, modifiedBy: functionName },
  };

  LOG.trace('addOrUpdateOapDataSource Request:', item);
  // The AWS Service needs to be initialised inside the function being tested in order for the SDK method to be mocked
  const docClient = new DynamoDB.DocumentClient();
  const putResponse: DynamoDB.DocumentClient.PutItemOutput = await docClient.put(item).promise();
  LOG.trace('addOrUpdateOapDataSource Response:', putResponse);
  return `addOrUpdateOapDataSource with ID ${oapDataSource.ID} successful`;
};

/**
 * Update the status and comments of an existing Oap Datasoure record in DB
 *
 * @param id
 *    Record ID
 * @param status
 *    DataSourceStatus
 * @param comment
 *    Record's comment
 * @param functionName
 *    Lambda function name
 * @returns
 *    successful string message or throw error to caller to handle if any
 */
export const updateOapDataSourceStatus = async (id: string, status: DataSourceStatus, comment: string, functionName: string): Promise<string> => {
  if (!process.env.OAP_DATASOURCE_TABLE) {
    LOG.error('Configuration Error: process.env.OAP_DATASOURCE_TABLE is empty!');
    throw new Error('Configuration Error: process.env.OAP_DATASOURCE_TABLE is empty!');
  }

  const item = {
    TableName: process.env.OAP_DATASOURCE_TABLE,
    Key: {
      ID: id,
    },
    UpdateExpression: 'set dataSourceStatus = :m, modifiedAt=:o, modifiedBy=:p, comments=:q',
    ExpressionAttributeValues: {
      ':m': status,
      ':o': new Date().toISOString(),
      ':p': functionName,
      ':q': comment,
    },
  };

  LOG.trace('updateOapDataSourceStatus Request:', item);
  // The AWS Service needs to be initialised inside the function being tested in order for the SDK method to be mocked
  const docClient = new DynamoDB.DocumentClient();
  const putResponse: DynamoDB.DocumentClient.UpdateItemOutput = await docClient.update(item).promise();
  LOG.trace('updateOapDataSourceStatus Response:', putResponse);
  return `updateOapDataSourceStatus with ID ${id} successful`;
};

/**
 * Add new Oap OapAsset entry if not exist or update an existing entry
 *
 * @param oapAsset
 *
 * @returns
 *    successful string message or throw error to caller to handle if any
 */
export const addOrUpdateOapAsset = async (oapAsset: iOapAsset, functionName: string): Promise<string> => {
  LOG.trace('DynamoDBService - addOrUpdateOapAsset: Request:', oapAsset);

  if (!process.env.OAP_ASSETS_TABLE) {
    LOG.error('Configuration Error: process.env.OAP_ASSETS_TABLE is empty!');
    throw new Error('Configuration Error: process.env.OAP_ASSETS_TABLE is empty!');
  }

  const now = new Date().toISOString();
  const item: DynamoDB.DocumentClient.PutItemInput = {
    TableName: process.env.OAP_ASSETS_TABLE,
    Item: { ...oapAsset, createdAt: oapAsset.createdAt || now, createdBy: oapAsset.createdBy || functionName, modifiedAt: now, modifiedBy: functionName },
  };

  LOG.trace('addOrUpdateOapAsset Request:', item);
  // The AWS Service needs to be initialised inside the function being tested in order for the SDK method to be mocked
  const docClient = new DynamoDB.DocumentClient();
  const putResponse: DynamoDB.DocumentClient.PutItemOutput = await docClient.put(item).promise();
  LOG.trace('addOrUpdateOapAsset Response:', putResponse);

  // No exception, return success message
  return `addOrUpdateOapAsset with TrailerId ${oapAsset.trailerId} successful`;
};

/**
 * Query Oap Asset item from DynamoDB
 *
 * @param trailerId
 *      trailer id
 * @returns
 *      First Item from DB
 */
export const queryOAPAssetItem = async (trailerId: string): Promise<iOapAsset | null> => {
  if (!process.env.OAP_ASSETS_TABLE) {
    LOG.error('Configuration Error: process.env.OAP_ASSETS_TABLE is empty!');
    throw new Error('Configuration Error: process.env.OAP_ASSETS_TABLE is empty!');
  }
  const params: DynamoDB.DocumentClient.QueryInput = {
    ExpressionAttributeValues: {
      ':id': trailerId,
    },
    KeyConditionExpression: 'trailerId = :id',
    TableName: process.env.OAP_ASSETS_TABLE,
    ConsistentRead: true,
  };
  const response = await new DynamoDB.DocumentClient().query(params).promise();
  LOG.trace(`queryOAPAssetItem - response`, response);
  return response.Items ? response.Items[0] : (null as any);
};
