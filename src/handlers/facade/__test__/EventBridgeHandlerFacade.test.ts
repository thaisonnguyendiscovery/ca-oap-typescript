import { handleInvalidFileExtension, handleInvalidFileSchema, processOapXmlRecord, readDatasourceFromS3 } from 'src/handlers/facade/EventBridgeHandlerFacade';
import * as EventBridgeHandlerHelper from 'src/handlers/helpers/EventBridgeHandlerHelper';
import * as NotificationService from 'src/services/NotificationService';
import * as S3Service from 'src/services/S3Service';

import * as xml2js from 'xml2js';

describe('EventBridgeHandlerFacade Test', () => {
  afterEach(jest.resetAllMocks);

  it('should readDatasourceFromS3', async () => {
    // Arrange
    jest.spyOn(S3Service, 'readFileS3').mockResolvedValueOnce('<?xml version="1.0" encoding="ISO-8859-1"?><dummy></dummy>').mockResolvedValue('');
    // Act
    const xmlObj = await readDatasourceFromS3({ bucketName: 'string', key: 'string' });
    // Assertions
    expect(xmlObj).toEqual({ dummy: '' });

    // Arrange
    jest.spyOn(xml2js, 'parseStringPromise').mockResolvedValueOnce(null);
    // Act
    const failedCase = await readDatasourceFromS3({ bucketName: 'string', key: 'string' });
    // Assertions
    expect(failedCase).toBe(undefined);
  });

  it('should handleInvalidFileExtension', async () => {
    // Arrange
    jest.spyOn(EventBridgeHandlerHelper, 'writeInvalidOapXmlExtensionToDB').mockResolvedValue('OK');
    jest.spyOn(NotificationService, 'sendSlackMessage').mockRejectedValueOnce('Error').mockResolvedValue('OK');

    // Act
    const rejectedCase: boolean = await handleInvalidFileExtension('/noextension', 'lambda-func-name', new Date().toISOString());
    // Assertions
    expect(rejectedCase).toBe(false);

    // Act
    const successCase: boolean = await handleInvalidFileExtension('/wrongextension.json', 'lambda-func-name', new Date().toISOString());
    // Assertions
    expect(successCase).toBe(true);
  });

  it('should handleInvalidFileSchema', async () => {
    // Arrange
    jest.spyOn(EventBridgeHandlerHelper, 'writeInvalidOapXmlSchemaToDB').mockResolvedValue('OK');
    jest.spyOn(NotificationService, 'sendSlackMessage').mockRejectedValueOnce('Error').mockResolvedValue('OK');
    jest.spyOn(S3Service, 'moveFileS3').mockRejectedValueOnce('Error').mockResolvedValue(true);

    // Act
    const rejectedCase: boolean = await handleInvalidFileSchema({ bucketName: 'string', key: '/file.xml' }, 'lambda-func-name', new Date().toISOString(), [{}]);
    // Assertions
    expect(rejectedCase).toBe(false);

    // Act
    const successCase: boolean = await handleInvalidFileSchema({ bucketName: 'string', key: '/file.xml' }, 'lambda-func-name', new Date().toISOString(), [{}]);
    // Assertions
    expect(successCase).toBe(true);
  });

  it('should processOapXmlRecord', async () => {
    // Arrange
    jest.spyOn(EventBridgeHandlerHelper, 'sendOapMessageQueue').mockRejectedValueOnce('Error').mockResolvedValue('OK');
    jest.spyOn(EventBridgeHandlerHelper, 'writeSuccessOapXmlToDB').mockRejectedValueOnce('Error').mockResolvedValue('OK');
    jest.spyOn(S3Service, 'moveFileS3').mockRejectedValueOnce('Error').mockResolvedValue(true);
    jest.spyOn(NotificationService, 'sendSlackMessage').mockRejectedValueOnce('Error').mockResolvedValue('OK');

    // Act
    const rejectedCase: boolean = await processOapXmlRecord({ bucketName: 'string', key: '/file.xml' }, {} as any, 'lambda-func-name', new Date().toISOString());
    // Assertions
    expect(rejectedCase).toBe(false);

    // Act
    const successCase: boolean = await processOapXmlRecord({ bucketName: 'string', key: '/file.xml' }, {} as any, 'lambda-func-name', new Date().toISOString());
    // Assertions
    expect(successCase).toBe(true);
  });
});
