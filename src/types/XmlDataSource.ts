export interface iSqsMessageXmlDataSource {
  id: string;
  fileName: string;
  content: iXmlDataSource;
}
export interface iXmlDataSource {
  trailers: iTrailersWrapper;
}

export interface iTrailersWrapper {
  countryCode: string;
  username: string;
  trailer: Array<iTrailer>;
}

export interface iTrailer {
  id: string;
  title: string;
  disclaimer?: string;
  branding?: string;
  mediaAsset: string;
  mediaID?: string;
  showTitle: string;
  promotedChannel: string;
  duration: string;
  versionType?: string;
  seasonNumber?: string;
  episodeNumber?: string;
  associatedFiles: Array<iAssociatedFile>;
}

export interface iAssociatedFile {
  videoFile: string;
  audioFile: string;
  outputFilename: string;
  sponsorTail?: string;
  keyartOrImage?: string;
  titleArt?: string;
}
