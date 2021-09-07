export enum DataSourceStatus {
  FAILED = 'Failed',
  PASSED = 'Validated',
  VALIDATING = 'Validating',
  NOT_AVAILABLE = 'Not Available',
  AVAILABLE = 'Available',
  INCOMPLETE = 'Incomplete',
  PROCESSING = 'Processing',
  FINISHED = 'Finished',
}

export enum DataSourceValidationComment {
  SUCCESS = 'Successfully Validated',
  INVALID_XML = 'Invalid Format',
  INVALID_FILE_EXTENSION = 'Invalid XML file.',
}

export enum ErrorCode {
  INVALID_XML_EXTENSION_ERR = 'OAP-101',
  INVALID_XML_SCHEMA_ERR = 'OAP-201',
  RUNTIME_ERR = 'OAP-301',
  TRANSLATION_ERR = 'OAP-401',
  OAP_WOCHIT_RENDITION_NO_RECORDS = 'CA-OAP-WOCHIT-RENDITION-101',
  OAP_WOCHIT_RENDITION_RUNTIME_ERR = 'CA-OAP-WOCHIT-RENDITION-301',
}

export enum PromiseStatus {
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected',
}

export enum ApiStatus {
  FAILED = 'Failed',
  success = 'Success',
}

export enum LogLevel {
  TRACE = 'Trace',
  DEBUG = 'Debug',
  INFO = 'Info',
  WARN = 'Warn',
  ERROR = 'Error',
  FATAL = 'Fatal',
}

export enum PromoAssetStatus {
  PENDING_UPLOAD = 'Pending Upload',
  PENDING_WOCHIT = 'Pending Wochit',
  RE_RENDER = 'Re-Render Request',
  PROCESSING = 'Processing',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
  VERSION_TYPE_UPDATE = 'Version Type Update',
  VERSION_TYPE_DELETE = 'Version Type Delete',
}

export enum AssetAvailabilityStatus {
  AVAILABLE = 'Available',
  NOT_AVAILABLE = 'Not Available',
  NOT_REQUIRED = 'Not Required',
}

export enum WochitRenditionStatus {
  NOT_STARTED = 'Not Started',
  PROCESSING = 'Processing',
  FINISHED = 'Finished',
  ERROR = 'Error',
}

export enum AssetType {
  FILM = 'Films',
  SHOW = 'Shows',
}

export enum SubAssetType {
  FILM = 'film',
  LAUNCH = 'launch',
  PRE_LAUNCH = 'prelaunch',
  TEASER = 'teaser',
}

export enum TemplateType {
  DPLUS = 'DPlus',
  COMBI = 'Combi',
  SPORT = 'Sport',
}
