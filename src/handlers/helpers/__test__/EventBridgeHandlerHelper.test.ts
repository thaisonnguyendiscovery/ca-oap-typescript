import { sendOapMessageQueue, writeInvalidOapXmlExtensionToDB, writeInvalidOapXmlSchemaToDB, writeSuccessOapXmlToDB } from 'src/handlers/helpers/EventBridgeHandlerHelper';
import * as DynamoDBService from 'src/services/DynamoDBService';
import * as SqsService from 'src/services/SqsService';
describe('EventBridgeHandlerHelper test', () => {
  afterEach(jest.resetAllMocks);
  it('should writeInvalidOapXmlExtensionToDB', async () => {
    jest
      .spyOn(DynamoDBService, 'addOrUpdateOapDataSource')
      .mockImplementationOnce(() => {
        throw new Error('exception thrown from service');
      })
      .mockResolvedValue('ok');

    // throw any exception to the caller
    expect(() => writeInvalidOapXmlExtensionToDB('/file', 'lambda-func-name')).toThrow('exception thrown from service');

    const response = await writeInvalidOapXmlExtensionToDB('/file_name_sg_sth.json', 'lambda-func-name');
    expect(response).toBe('ok');
  });

  it('should writeInvalidOapXmlSchemaToDB', async () => {
    jest
      .spyOn(DynamoDBService, 'addOrUpdateOapDataSource')
      .mockImplementationOnce(() => {
        throw new Error('exception thrown from service');
      })
      .mockResolvedValue('ok');

    // throw any exception to the caller
    expect(() => writeInvalidOapXmlSchemaToDB({ bucketName: 'string', key: '/file.xml' }, 'lambda-func-name', [{}])).toThrow('exception thrown from service');

    const response = await writeInvalidOapXmlSchemaToDB({ bucketName: 'string', key: '/file_name_sg_sth.xml' }, 'lambda-func-name', [{}]);
    expect(response).toBe('ok');
  });

  it('shoould writeSuccessOapXmlToDB', async () => {
    jest
      .spyOn(DynamoDBService, 'addOrUpdateOapDataSource')
      .mockImplementationOnce(() => {
        throw new Error('exception thrown from service');
      })
      .mockResolvedValue('ok');

    const datasource = {
      trailers: {
        countryCode: 'FI',
        username: 'Peter Rothoff Hojholt',
      },
    };

    // throw any exception to the caller
    expect(() => writeSuccessOapXmlToDB(datasource as any, '/file_name_sg_sth.xml', 'lambda-func-name', '123')).toThrow('exception thrown from service');

    const response = await writeSuccessOapXmlToDB(datasource as any, '/file_name_sg_sth.xml', 'lambda-func-name', '123');
    expect(response).toBe('ok');
  });

  it('should sendOapMessageQueue', async () => {
    jest
      .spyOn(SqsService, 'sendMessageQueue')
      .mockImplementationOnce(() => {
        throw new Error('exception thrown from service');
      })
      .mockResolvedValue('ok');

    const datasource = {
      trailers: {
        countryCode: 'FI',
        username: 'Peter Rothoff Hojholt',
      },
    };

    // throw any exception to the caller
    expect(() => sendOapMessageQueue(datasource as any, '/file_name_sg_sth.xml', '123')).toThrow('exception thrown from service');

    const response = await sendOapMessageQueue(datasource as any, '/file_name_sg_sth.xml', '123');
    expect(response).toBe('ok');
  });
});
