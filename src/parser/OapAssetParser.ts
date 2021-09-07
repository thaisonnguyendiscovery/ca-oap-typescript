import { iAssociatedFile, iSqsMessageXmlDataSource, iTrailer, iTrailersWrapper } from 'src/types/XmlDataSource';
import { mapValue, setDefaultLocale, translate } from 'src/i18n/i18n';
import { AssetAvailabilityStatus, AssetType, PromoAssetStatus, SubAssetType, TemplateType, WochitRenditionStatus } from 'src/utils/Enums';
import { iOapAsset } from 'src/types/OapAsset';
import { BUNDLE_REGEX, EPISODE_REGEX, GENERIC_REGEX } from 'src/utils/Constants';
import LOG from 'src/utils/Logger';

interface iAssetTitleInfo {
  subType: string | null;
  brand: string | null;
  tag: string | null;
  dPlusCta: string | null;
  time: string | null;
}

/**
 * Build OapAsset Object from trailer object
 *
 * @param trailer
 *      trailer object from xml
 * @param sqsMessage
 *      SQS message object to get general info
 * @param functionName
 *      Lambda function name
 * @returns
 *      OapAssetObject
 */
export const buildOapAsset = (trailer: iTrailer, sqsMessage: iSqsMessageXmlDataSource, functionName: string): iOapAsset => {
  const { id, fileName, content }: iSqsMessageXmlDataSource = sqsMessage;
  const { countryCode, username }: iTrailersWrapper = content.trailers;

  setDefaultLocale(countryCode);

  const trailerAssociatedFile: iAssociatedFile = trailer.associatedFiles[0];
  const titleInfo = decodeAssetTitle(trailer.title?.trim());

  const result: iOapAsset = {
    createdAt: new Date().toISOString(),
    createdBy: functionName,
    promoXMLId: id,
    promoXMLName: fileName,
    showTitle: trailer.showTitle,
    mediaAssetId: trailer.mediaAsset,
    duration: trailer.duration,
    type: getAssetType(titleInfo.subType),
    templateType: mapValue(`channel2template_${trailer.promotedChannel}`, TemplateType.COMBI), // map channel to template, default to COMBI
    country: translate('countryName'),
    promotedChannel: translate(`channel_${trailer.promotedChannel}`),
    subType: getShowSubCollectionType(titleInfo.subType),
    trailerId: trailer.id,
    mediaId: trailer.mediaID,
    seasonNumber: trailer.seasonNumber ? 'S' + String(trailer.seasonNumber).padStart(2, '0') : '',
    episodeNumber: trailer.episodeNumber ? 'E' + String(trailer.episodeNumber).padStart(2, '0') : '',
    userName: username,
    xmlMetadata: {
      data: {
        tag: translate(`tag_${titleInfo.tag}`) || null,
        title: trailer.title || null,
        dPlusCta: translate(`cta_${titleInfo.dPlusCta}`) || null,
        brand: translate(`brand_${titleInfo.brand}`) || null,
        disclaimer: trailer.disclaimer || null,
        time: translate(`tag_date_${titleInfo.time}`) || null,
        branding: trailer.branding || null,
        versionType: trailer.versionType || null,
      },
    },
    isMetadataUpdateRequired: false,
    sourceVideoFileStatus: AssetAvailabilityStatus.NOT_AVAILABLE,
    sourceAudioFileStatus: AssetAvailabilityStatus.NOT_AVAILABLE,
    sponsorFileStatus: trailerAssociatedFile.sponsorTail ? AssetAvailabilityStatus.NOT_AVAILABLE : AssetAvailabilityStatus.NOT_REQUIRED,
    outputFileStatus: AssetAvailabilityStatus.NOT_AVAILABLE,
    wochitVideoId: null,
    wochitRenditionStatus: WochitRenditionStatus.NOT_STARTED,
    associatedFiles: {
      // TODO: mapping a list of associatedFiles in xml to 1 item ?
      sourceVideoFileName: trailerAssociatedFile.videoFile || null, // TODO: is undefined also ok ?
      sourceAudioFileName: trailerAssociatedFile.audioFile || null,
      outputFilename: trailerAssociatedFile.outputFilename || null,
      sponsorFileName: trailerAssociatedFile.sponsorTail || null,
      keyArtFileName: trailerAssociatedFile.keyartOrImage || null,
      titleArtFileName: trailerAssociatedFile.titleArt || null,
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
  LOG.trace(`OapAssetParser - mapping`, trailer, 'to', result);
  return result;
};

export const decodeAssetTitle = (title: string): iAssetTitleInfo => {
  const titleInfo: iAssetTitleInfo = {
    subType: null,
    brand: null,
    tag: null,
    dPlusCta: null,
    time: null,
  };

  const titleSplit = title.split(/(_\d*_)/);
  if (titleSplit.length < 3) {
    return titleInfo;
  }
  titleInfo.subType = titleSplit[0].split('_').pop() || null;
  const items = titleSplit[2].split('_');

  items.forEach((item) => {
    if (item.match(/^(\d{2}(:)?\d{2})$/)) {
      titleInfo.time = item;
    } else if (translate(`brand_${item}`)) {
      titleInfo.brand = item;
    } else if (translate(`cta_${item}`)) {
      titleInfo.dPlusCta = item;
    } else if (translate(`tag_${item}`)) {
      titleInfo.tag = item;
    } else if (item.match(/^(\d{1,2}[a-z]{3})$/)) {
      titleInfo.tag = item;
    }
  });

  return titleInfo;
};

/**
 * ONBOARDING
 */
const getAssetType = (item: string | null): string | null => {
  if (!item) {
    return null;
  }
  if (item.match(BUNDLE_REGEX)) {
    return AssetType.SHOW;
  } else if (item.match(GENERIC_REGEX)) {
    return AssetType.SHOW;
  } else if (item.match(EPISODE_REGEX)) {
    return AssetType.SHOW;
  } else if (item === SubAssetType.FILM) {
    return AssetType.FILM;
  } else if (item === SubAssetType.LAUNCH) {
    return AssetType.SHOW;
  } else if (item === SubAssetType.PRE_LAUNCH) {
    return AssetType.SHOW;
  } else if (item === SubAssetType.TEASER) {
    return AssetType.SHOW;
  }
  return null;
};

const getShowSubCollectionType = (item: string | null): string | null => {
  if (!item) {
    return null;
  }
  if (item === SubAssetType.LAUNCH || item === SubAssetType.PRE_LAUNCH || item === SubAssetType.TEASER) {
    return item;
  }
  if (item.match(EPISODE_REGEX) || item.match(BUNDLE_REGEX) || item.match(GENERIC_REGEX)) {
    return item;
  }
  return null;
};
