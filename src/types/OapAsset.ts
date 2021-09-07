import { AssetAvailabilityStatus, PromoAssetStatus, WochitRenditionStatus } from 'src/utils/Enums';

export interface iOapAsset {
  createdAt: string;
  createdBy: string;
  modifiedAt?: string;
  modifiedBy?: string;
  promoXMLId: string;
  promoXMLName: string;
  showTitle: string;
  mediaAssetId: string;
  duration: string;
  type?: string | null;
  templateType: string;
  country: string;
  promotedChannel: string;
  subType: string | null;
  trailerId: string;
  mediaId?: string;
  seasonNumber: string;
  episodeNumber: string;
  userName: string;
  xmlMetadata: {
    data: {
      tag: string | null;
      title: string | null;
      dPlusCta: string | null;
      brand: string | null;
      disclaimer: string | null;
      time: string | null;
      branding: string | null;
      versionType: string | null;
    };
  };
  isMetadataUpdateRequired: boolean;
  sourceVideoFileStatus: AssetAvailabilityStatus;
  sourceAudioFileStatus: AssetAvailabilityStatus;
  sponsorFileStatus: AssetAvailabilityStatus;
  outputFileStatus: AssetAvailabilityStatus;
  wochitVideoId?: string | null;
  wochitRenditionStatus: WochitRenditionStatus;
  associatedFiles: {
    sourceVideoFileName?: string | null;
    sourceAudioFileName?: string | null;
    outputFilename?: string | null;
    sponsorFileName?: string | null;
    keyArtFileName?: string | null;
    titleArtFileName?: string | null;
  };
  iconikObjectIds: {
    sourceVideoAssetId?: string | null;
    sourceAudioAssetId?: string | null;
    sponsorAssetId?: string | null;
    outputAssetId?: string | null;
    showTitleCollectionId?: string | null;
    seasonCollectionId?: string | null;
    episodeCollectionId?: string | null;
    mediaAssetCollectionId?: string | null;
    outputCollectionId?: string | null;
  };
  promoAssetStatus: PromoAssetStatus;
  comments: string;
}
