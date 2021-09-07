import { handle } from 'src/handlers/EventBridgeEventHandler';
import * as EventBridgeHandlerFacade from 'src/handlers/facade/EventBridgeHandlerFacade';
import * as OapXmlValidator from 'src/validators/OapXmlValidator';

describe('EventBridgeEventHandler Test', () => {
  afterEach(jest.resetAllMocks);

  // buildding mock input
  const mockLambdaContext = {
    functionName: 'mock-lambda-func',
  };

  it('should handle invalid extension file case', async () => {
    // Arrange
    const mockInvalidExtensionEvent = {
      time: new Date().toISOString(),
      detail: {
        requestParameters: {
          key: '/dummy.json',
        },
      },
    };
    const mockHandleInvalidFileExtension = jest.fn();
    jest.spyOn(EventBridgeHandlerFacade, 'handleInvalidFileExtension').mockImplementation(mockHandleInvalidFileExtension);

    // Act
    await handle(mockInvalidExtensionEvent as any, mockLambdaContext as any);

    // Assert
    expect(mockHandleInvalidFileExtension).toHaveBeenCalled();
  });

  it('should handle case when cannot read file from S3', async () => {
    // Arrange
    const mockInvalidExtensionEvent = {
      time: new Date().toISOString(),
      detail: {
        requestParameters: {
          key: '/dummy.xml',
        },
      },
    };
    const mockHandleInvalidFileExtension = jest.fn(),
      mockValidateSchemaFn = jest.fn();

    jest.spyOn(EventBridgeHandlerFacade, 'readDatasourceFromS3').mockResolvedValue(undefined);
    jest.spyOn(EventBridgeHandlerFacade, 'handleInvalidFileExtension').mockImplementation(mockHandleInvalidFileExtension);
    jest.spyOn(OapXmlValidator, 'validateSchema').mockImplementation(mockValidateSchemaFn);

    // Act
    await handle(mockInvalidExtensionEvent as any, mockLambdaContext as any);

    // Assert
    expect(mockHandleInvalidFileExtension).not.toHaveBeenCalled();
    expect(mockValidateSchemaFn).not.toHaveBeenCalled();
  });

  it('should handle invalid file content schema', async () => {
    // Arrange
    const mockInvalidExtensionEvent = {
      time: new Date().toISOString(),
      detail: {
        requestParameters: {
          key: '/dummy.xml',
        },
      },
    };

    const mockProcessOapXmlRecordFn = jest.fn(),
      mockProcessInvalidSchemaFn = jest.fn();

    jest.spyOn(OapXmlValidator, 'validateSchema').mockReturnValue([{} as any]); // non-empty error list
    jest.spyOn(EventBridgeHandlerFacade, 'readDatasourceFromS3').mockResolvedValue({} as any); // dummy content
    jest.spyOn(EventBridgeHandlerFacade, 'handleInvalidFileSchema').mockImplementation(mockProcessInvalidSchemaFn);
    jest.spyOn(EventBridgeHandlerFacade, 'processOapXmlRecord').mockImplementation(mockProcessOapXmlRecordFn);

    // Act
    await handle(mockInvalidExtensionEvent as any, mockLambdaContext as any);

    // Assert
    expect(mockProcessInvalidSchemaFn).toHaveBeenCalled();
    expect(mockProcessOapXmlRecordFn).not.toHaveBeenCalled();
  });

  it('should process valid xml file', async () => {
    // Arrange
    const mockInvalidExtensionEvent = {
      time: new Date().toISOString(),
      detail: {
        requestParameters: {
          key: '/dummy.xml',
        },
      },
    };

    const mockProcessOapXmlRecord = jest.fn();
    jest.spyOn(OapXmlValidator, 'validateSchema').mockReturnValue([]);
    jest.spyOn(EventBridgeHandlerFacade, 'readDatasourceFromS3').mockResolvedValue({} as any);
    jest.spyOn(EventBridgeHandlerFacade, 'processOapXmlRecord').mockImplementation(mockProcessOapXmlRecord);

    // Act
    await handle(mockInvalidExtensionEvent as any, mockLambdaContext as any);

    // Assert
    expect(mockProcessOapXmlRecord).toHaveBeenCalled();
  });
});
