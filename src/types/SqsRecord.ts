export interface iSqsRecord {
  createdAt: string;
  createdBy: string;
  promoXMLId: string;
  promoXMLName: string;
  showTitle: string;
  mediaAssetId: string;
  duration: string;
  type: string;
  templateType: string;
  country: string;
  promotedChannel: string;
  subType: string;
  trailerId: string;
  mediaId: string;
  seasonNumber: string;
  episodeNumber: string;
  userName: string;
  xmlMetadata: iXmlMetadata;
  isMetadataUpdateRequired: boolean;
  sourceVideoFileStatus: string;
  sourceAudioFileStatus: string;
  sponsorFileStatus: string;
  outputFileStatus: string;
  wochitVideoId: string;
  wochitRenditionStatus: string;
  associatedFiles: iAssociatedFile;
  iconikObjectIds: iIconikObjectIds;
  promoAssetStatus: string;
  comments: string;
}

export interface iXmlMetadata {
  data: iXmlMeta;
}

export interface iXmlMeta {
  tag: string;
  title: string;
  dPlusCta: string;
  brand: string;
  disclaimer: string;
  time: string;
  branding: string;
  versionType: string;
}

export interface iAssociatedFile {
  sourceVideoFileName?: string;
  sourceAudioFileName?: string;
  sponsorFileName?: string;
  keyArtFileName?: string;
  titleArtFileName?: string;
  outputFilename?: string;
}

export interface iIconikObjectIds {
  sourceVideoAssetId: string;
  sourceAudioAssetId?: string;
  sponsorAssetId?: string;
  outputAssetId?: string;
  showTitleCollectionId?: string;
  seasonCollectionId?: string;
  episodeCollectionId?: string;
  mediaAssetCollectionId?: string;
  outputCollectionId?: string;
}
