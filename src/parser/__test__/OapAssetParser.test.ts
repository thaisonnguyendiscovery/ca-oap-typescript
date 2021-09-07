import { buildOapAsset } from 'src/parser/OapAssetParser';
import { iOapAsset } from 'src/types/OapAsset';
import { iSqsMessageXmlDataSource, iTrailer } from 'src/types/XmlDataSource';
import { AssetAvailabilityStatus, PromoAssetStatus, WochitRenditionStatus } from 'src/utils/Enums';

describe('OapAssetParser Test', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date('2020-01-01T00:00:00.000Z'));
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  it('should build OapAsset obect from Trailer object', async () => {
    const trailer: iTrailer = {
      id: '109238745600001',
      title: 'X tv5_Qa Shows_s03_e08_30_seasonprem_Monday_20:30_streamalleps',
      mediaAsset: 'FI109238745600001',
      mediaID: '729939_1',
      showTitle: 'Qa Shows',
      promotedChannel: 'tv5',
      duration: '30',
      versionType: 'Monday',
      seasonNumber: undefined,
      episodeNumber: undefined,
      associatedFiles: [
        {
          videoFile: 'tv5_FI109238745600001_30.mxf',
          audioFile: 'tv5_FI109238745600001_Monday_30.wav',
          outputFilename: 'FI109238745600001_X_tv5_Qa_Shows_s03_e08_30_seasonprem_Monday_20:30_streamalleps.mxf\n            ',
          sponsorTail: 'file_name',
          keyartOrImage: 'Qa_Shows_s03_image.jpg',
          titleArt: 'Qa_Shows_s03_titleart.png',
        },
      ],
    };

    const sqsMessage: iSqsMessageXmlDataSource = {
      id: 'd74604d0-032b-11ec-bd6c-21b5d2601627',
      fileName: '1624603096995_promo_generation_qa.xml',
      content: {
        trailers: {
          countryCode: 'FI',
          username: 'Peter Rothoff Hojholt',
          trailer: [],
        },
      },
    };

    const oapAsset: iOapAsset = {
      createdAt: '2020-01-01T00:00:00.000Z',
      createdBy: 'ca-oap-typescript-SqsEventHandler-thaison',
      promoXMLId: 'd74604d0-032b-11ec-bd6c-21b5d2601627',
      promoXMLName: '1624603096995_promo_generation_qa.xml',
      showTitle: 'Qa Shows',
      mediaAssetId: 'FI109238745600001',
      duration: '30',
      type: 'Shows',
      templateType: 'Combi',
      country: 'Finland',
      promotedChannel: 'TV5',
      subType: 'e08',
      trailerId: '109238745600001',
      mediaId: '729939_1',
      seasonNumber: '',
      episodeNumber: '',
      userName: 'Peter Rothoff Hojholt',
      xmlMetadata: {
        data: {
          tag: 'maanantaina',
          title: 'X tv5_Qa Shows_s03_e08_30_seasonprem_Monday_20:30_streamalleps',
          dPlusCta: 'katso kaikki jaksot',
          brand: 'uusi kausi',
          disclaimer: null,
          time: null,
          branding: null,
          versionType: 'Monday',
        },
      },
      isMetadataUpdateRequired: false,
      sourceVideoFileStatus: AssetAvailabilityStatus.NOT_AVAILABLE,
      sourceAudioFileStatus: AssetAvailabilityStatus.NOT_AVAILABLE,
      sponsorFileStatus: AssetAvailabilityStatus.NOT_AVAILABLE,
      outputFileStatus: AssetAvailabilityStatus.NOT_AVAILABLE,
      wochitVideoId: null,
      wochitRenditionStatus: WochitRenditionStatus.NOT_STARTED,
      associatedFiles: {
        sourceVideoFileName: 'tv5_FI109238745600001_30.mxf',
        sourceAudioFileName: 'tv5_FI109238745600001_Monday_30.wav',
        outputFilename: 'FI109238745600001_X_tv5_Qa_Shows_s03_e08_30_seasonprem_Monday_20:30_streamalleps.mxf\n            ',
        sponsorFileName: 'file_name',
        keyArtFileName: 'Qa_Shows_s03_image.jpg',
        titleArtFileName: 'Qa_Shows_s03_titleart.png',
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
      promoAssetStatus: PromoAssetStatus.PROCESSING,
      comments: 'Pending Asset Upload',
    };

    expect(buildOapAsset(trailer, sqsMessage, 'ca-oap-typescript-SqsEventHandler-thaison')).toEqual(oapAsset);
  });

  it('should build OapAsset obect from Trailer object with lesser data', async () => {
    const trailer: iTrailer = {
      id: '109238745600001',
      title: '',
      mediaAsset: 'FI109238745600001',
      mediaID: '729939_1',
      showTitle: 'Qa Shows',
      promotedChannel: 'tv5',
      duration: '30',
      versionType: '',
      seasonNumber: '3',
      episodeNumber: '8',
      associatedFiles: [
        {
          videoFile: '',
          audioFile: '',
          outputFilename: '',
          sponsorTail: '',
          keyartOrImage: '',
          titleArt: '',
        },
      ],
    };

    const sqsMessage: iSqsMessageXmlDataSource = {
      id: 'd74604d0-032b-11ec-bd6c-21b5d2601627',
      fileName: '1624603096995_promo_generation_qa.xml',
      content: {
        trailers: {
          countryCode: 'FI',
          username: 'Peter Rothoff Hojholt',
          trailer: [],
        },
      },
    };

    const oapAsset: iOapAsset = {
      createdAt: '2020-01-01T00:00:00.000Z',
      createdBy: 'ca-oap-typescript-SqsEventHandler-thaison',
      promoXMLId: 'd74604d0-032b-11ec-bd6c-21b5d2601627',
      promoXMLName: '1624603096995_promo_generation_qa.xml',
      showTitle: 'Qa Shows',
      mediaAssetId: 'FI109238745600001',
      duration: '30',
      type: null,
      templateType: 'Combi',
      country: 'Finland',
      promotedChannel: 'TV5',
      subType: null,
      trailerId: '109238745600001',
      mediaId: '729939_1',
      seasonNumber: 'S03',
      episodeNumber: 'E08',
      userName: 'Peter Rothoff Hojholt',
      xmlMetadata: {
        data: {
          tag: null,
          title: null,
          dPlusCta: null,
          brand: null,
          disclaimer: null,
          time: null,
          branding: null,
          versionType: null,
        },
      },
      isMetadataUpdateRequired: false,
      sourceVideoFileStatus: AssetAvailabilityStatus.NOT_AVAILABLE,
      sourceAudioFileStatus: AssetAvailabilityStatus.NOT_AVAILABLE,
      sponsorFileStatus: AssetAvailabilityStatus.NOT_REQUIRED,
      outputFileStatus: AssetAvailabilityStatus.NOT_AVAILABLE,
      wochitVideoId: null,
      wochitRenditionStatus: WochitRenditionStatus.NOT_STARTED,
      associatedFiles: {
        sourceVideoFileName: null,
        sourceAudioFileName: null,
        outputFilename: null,
        sponsorFileName: null,
        keyArtFileName: null,
        titleArtFileName: null,
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
      promoAssetStatus: PromoAssetStatus.PROCESSING,
      comments: 'Pending Asset Upload',
    };

    expect(buildOapAsset(trailer, sqsMessage, 'ca-oap-typescript-SqsEventHandler-thaison')).toEqual(oapAsset);
  });
});
