import { addOrUpdateOapAsset, addOrUpdateOapDataSource, queryOAPAssetItem, updateOapDataSourceStatus } from 'src/services/DynamoDBService';
import AWSMock from 'aws-sdk-mock';
import AWS, { DynamoDB } from 'aws-sdk';
import { AssetAvailabilityStatus, DataSourceStatus, PromoAssetStatus, WochitRenditionStatus } from 'src/utils/Enums';
import { iOapAsset } from 'src/types/OapAsset';

describe('DynamoDBService Test', () => {
  const OLD_ENVS = process.env;
  beforeEach(() => {
    jest.resetModules(); // clear test cache
    process.env = { ...OLD_ENVS };
  });
  afterAll(() => {
    process.env = OLD_ENVS;
  });
  afterEach(jest.resetAllMocks);

  /**
   * addOrUpdateOapDataSource
   */
  it('should throw exception if not configured correctly when addOrUpdateOapDataSource', async () => {
    await expect(addOrUpdateOapDataSource({ ID: '123' }, 'abc')).rejects.toThrow(Error('Configuration Error: process.env.OAP_DATASOURCE_TABLE is empty!'));
  });

  it('should addOrUpdateOapDataSource', async () => {
    process.env.OAP_DATASOURCE_TABLE = 'dummy-table-name';
    AWS.config.update({ region: 'eu-central-1' });

    AWSMock.setSDKInstance(AWS);
    AWSMock.mock('DynamoDB.DocumentClient', 'put', (_params: DynamoDB.DocumentClient.PutItemOutput, callback: (...args: any) => void) => {
      callback(null, {});
    });

    const datasource = {
      ID: '123',
      trailers: {
        countryCode: 'FI',
        username: 'Peter Rothoff Hojholt',
      },
    };

    // Act
    const response = await addOrUpdateOapDataSource(datasource as any, 'abc');

    // Assertions
    expect(response).toEqual('addOrUpdateOapDataSource with ID 123 successful');
    AWSMock.restore('DynamoDB.DocumentClient');
  });

  /**
   * updateOapDataSourceStatus
   */
  it('should throw exception if not configured correctly when updateOapDataSourceStatus', async () => {
    process.env = OLD_ENVS;
    await expect(updateOapDataSourceStatus('mock-id', DataSourceStatus.FINISHED, 'mock-comment', 'mock-func-name')).rejects.toThrow(Error('Configuration Error: process.env.OAP_DATASOURCE_TABLE is empty!'));
  });

  it('should updateOapDataSourceStatus', async () => {
    process.env.OAP_DATASOURCE_TABLE = 'dummy-table-name';
    AWS.config.update({ region: 'eu-central-1' });

    AWSMock.setSDKInstance(AWS);
    AWSMock.mock('DynamoDB.DocumentClient', 'update', (_params: DynamoDB.DocumentClient.UpdateItemOutput, callback: (...args: any) => void) => {
      callback(null, {});
    });

    // Act
    const response = await updateOapDataSourceStatus('mock-id', DataSourceStatus.FINISHED, 'mock-comment', 'mock-func-name');

    // Assertions
    expect(response).toEqual(`updateOapDataSourceStatus with ID mock-id successful`);
    AWSMock.restore('DynamoDB.DocumentClient');
  });

  /**
   * addOrUpdateOapAsset
   */
  it('should throw exception if not configured correctly when addOrUpdateOapAsset', async () => {
    process.env = OLD_ENVS;
    await expect(addOrUpdateOapAsset({} as any, 'mock-func-name')).rejects.toThrow(Error('Configuration Error: process.env.OAP_ASSETS_TABLE is empty!'));
  });

  it('should addOrUpdateOapAsset', async () => {
    process.env.OAP_ASSETS_TABLE = 'dummy-table-name';
    AWS.config.update({ region: 'eu-central-1' });

    AWSMock.setSDKInstance(AWS);
    AWSMock.mock('DynamoDB.DocumentClient', 'put', (_params: DynamoDB.DocumentClient.PutItemOutput, callback: (...args: any) => void) => {
      callback(null, {});
    });

    const oapAsset: iOapAsset = {
      createdAt: '2021-08-22T09:32:18.519Z',
      createdBy: 'ca-oap-typescript-SqsEventHandler-thaison',
      promoXMLId: 'd74604d0-032b-11ec-bd6c-21b5d2601627',
      promoXMLName: '1624603096995_promo_generation_qa.xml',
      showTitle: 'QA SEASONS',
      mediaAssetId: 'FI109238745600005',
      duration: '15',
      type: 'Shows',
      templateType: 'DPlus',
      country: 'Finland',
      promotedChannel: 'Discovery+',
      subType: 'prelaunch',
      trailerId: '109238745600005',
      seasonNumber: 'S18',
      episodeNumber: '',
      userName: 'Peter Rothoff Hojholt',
      xmlMetadata: {
        data: {
          tag: '',
          title: 'X dp_QA Seasons_s18_prelaunch_15_newseason_27may',
          dPlusCta: null,
          brand: 'uusi kausi',
          disclaimer: null,
          time: null,
          branding: null,
          versionType: 'Date',
        },
      },
      isMetadataUpdateRequired: false,
      sourceVideoFileStatus: AssetAvailabilityStatus.NOT_AVAILABLE,
      sourceAudioFileStatus: AssetAvailabilityStatus.NOT_AVAILABLE,
      sponsorFileStatus: AssetAvailabilityStatus.NOT_REQUIRED,
      outputFileStatus: AssetAvailabilityStatus.AVAILABLE,
      wochitVideoId: null,
      wochitRenditionStatus: WochitRenditionStatus.FINISHED,
      associatedFiles: {
        sourceVideoFileName: 'dp_FI109238745600005_15.mxf',
        sourceAudioFileName: 'dp_FI109238745600005_Date_15.wav',
        outputFilename: 'FI109238745600005_X_dp_Qa_seasons_s18_prelaunch_15_newseason_27may.mxf',
        sponsorFileName: null,
        keyArtFileName: 'Qa_seasons_s18_image.jpg',
        titleArtFileName: 'Qa_seasons_s18_titleart.png',
      },
      iconikObjectIds: {
        sourceVideoAssetId: null,
        sourceAudioAssetId: null,
        sponsorAssetId: null,
        outputAssetId: null,
        showTitleCollectionId: null,
        seasonCollectionId: null,
        episodeCollectionId: null,
        mediaAssetCollectionId: null,
        outputCollectionId: null,
      },
      promoAssetStatus: PromoAssetStatus.COMPLETED,
      comments: 'Pending Asset Upload',
      modifiedAt: '2021-08-22T09:32:18.841Z',
      modifiedBy: 'ca-oap-typescript-SqsEventHandler-thaison',
    };

    // Act
    const response = await addOrUpdateOapAsset(oapAsset, 'mock-func-name');

    // Assertions
    expect(response).toEqual(`addOrUpdateOapAsset with TrailerId ${oapAsset.trailerId} successful`);
    AWSMock.restore('DynamoDB.DocumentClient');
  });

  /**
   * queryOAPAssetItem
   */
  it('should throw exception if not configured correctly when queryOAPAssetItem', async () => {
    process.env = OLD_ENVS;
    await expect(queryOAPAssetItem('123')).rejects.toThrow(Error('Configuration Error: process.env.OAP_ASSETS_TABLE is empty!'));
  });

  it('should queryOAPAssetItem by trailerID', async () => {
    process.env.OAP_ASSETS_TABLE = 'dummy-table-name';

    AWSMock.setSDKInstance(AWS);
    AWSMock.mock('DynamoDB.DocumentClient', 'query', (_params: DynamoDB.DocumentClient.QueryOutput, callback: (...args: any) => void) => {
      callback(null, { Items: [{ xxx: 'xxx' }] });
    });

    const queryResponse = await queryOAPAssetItem('123');
    expect(queryResponse).toEqual({ xxx: 'xxx' });
  });
});
