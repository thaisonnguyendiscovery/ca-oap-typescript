import { iOapAsset } from 'src/types/OapAsset';
import { AssetAvailabilityStatus, PromoAssetStatus, WochitRenditionStatus } from 'src/utils/Enums';
import * as DynamoDBService from 'src/services/DynamoDBService';
import { updateExistingOapAsset } from 'src/handlers/facade/SqsEventHandlerFacade';
import { cloneDeep } from 'lodash';

describe('SqsEventHandlerFacade test', () => {
  beforeAll(() => {
    jest.spyOn(DynamoDBService, 'addOrUpdateOapAsset').mockResolvedValue('OK');
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
    outputFileStatus: AssetAvailabilityStatus.NOT_REQUIRED,
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

  it('should handle versionType delete case', async () => {
    const newAsset: iOapAsset = cloneDeep(oapAsset);
    const dbAsset: iOapAsset = cloneDeep(oapAsset);
    dbAsset.outputFileStatus = AssetAvailabilityStatus.AVAILABLE;
    dbAsset.xmlMetadata.data.versionType = 'Date2';

    const result = await updateExistingOapAsset(newAsset, dbAsset, 'mock-func-name');
    expect(result.promoAssetStatus).toBe(PromoAssetStatus.VERSION_TYPE_DELETE);
    expect(result.wochitRenditionStatus).toBe(WochitRenditionStatus.NOT_STARTED);
  });

  it('should handle versionType update case', async () => {
    const newAsset: iOapAsset = cloneDeep(oapAsset);
    const dbAsset: iOapAsset = cloneDeep(oapAsset);
    dbAsset.outputFileStatus = AssetAvailabilityStatus.NOT_AVAILABLE;
    dbAsset.xmlMetadata.data.versionType = 'Date2';

    const result = await updateExistingOapAsset(newAsset, dbAsset, 'mock-func-name');
    expect(result.promoAssetStatus).toBe(PromoAssetStatus.VERSION_TYPE_UPDATE);
  });
});
