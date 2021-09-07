import { iOapAsset } from 'src/types/OapAsset';
import LOG from 'src/utils/Logger';
import { AssetAvailabilityStatus, PromoAssetStatus, WochitRenditionStatus } from 'src/utils/Enums';
import { addOrUpdateOapAsset } from 'src/services/DynamoDBService';

/**
 * Update an existing Oap Asset record in DB, merging values from the oapAsset in request and the record from DB
 *
 * @param newOapAsset
 *        OapAsset object from request
 * @param dbOapAsset
 *        Existing OapAsset Object in DB
 * @param functionName
 *        lambda function name
 * @returns
 *        Result string from DynamoDB service
 */
export const updateExistingOapAsset = async (newOapAsset: iOapAsset, dbOapAsset: iOapAsset, functionName: string): Promise<iOapAsset> => {
  // Update existing oapAsset if metadata changed
  const isVersionTypeChanged = newOapAsset.xmlMetadata.data.versionType !== dbOapAsset.xmlMetadata.data.versionType;
  if (isVersionTypeChanged) {
    const oapAssetToUpdate = { ...dbOapAsset };
    oapAssetToUpdate.associatedFiles.sourceAudioFileName = newOapAsset.associatedFiles.sourceAudioFileName;
    oapAssetToUpdate.xmlMetadata.data.versionType = newOapAsset.xmlMetadata.data.versionType;
    if (dbOapAsset.outputFileStatus === AssetAvailabilityStatus.AVAILABLE) {
      LOG.trace(`SqsEventhandlerFacade - scenario : Version Type Delete received for ${newOapAsset.trailerId}`);
      oapAssetToUpdate.promoAssetStatus = PromoAssetStatus.VERSION_TYPE_DELETE;
      oapAssetToUpdate.iconikObjectIds.sourceAudioAssetId = null;
      oapAssetToUpdate.wochitVideoId = null;
      oapAssetToUpdate.wochitRenditionStatus = WochitRenditionStatus.NOT_STARTED;
    } else {
      LOG.trace(`SqsEventhandlerFacade - scenario : Version Type Update received for ${newOapAsset.trailerId}`);
      oapAssetToUpdate.promoAssetStatus = PromoAssetStatus.VERSION_TYPE_UPDATE;
      oapAssetToUpdate.iconikObjectIds.sourceAudioAssetId = null;
    }
    await addOrUpdateOapAsset(oapAssetToUpdate, functionName);
    return oapAssetToUpdate;
  } else {
    if (dbOapAsset.outputFileStatus === AssetAvailabilityStatus.AVAILABLE) {
      LOG.trace(`SqsEventhandlerFacade - scenario : Re-render received for trailer ${newOapAsset.trailerId}`);
      const oapAssetToUpdate = { ...dbOapAsset, promoAssetStatus: PromoAssetStatus.RE_RENDER, wochitVideoId: null, wochitRenditionStatus: WochitRenditionStatus.NOT_STARTED };
      await addOrUpdateOapAsset(oapAssetToUpdate, functionName);
      return oapAssetToUpdate;
    } else {
      LOG.trace(`SqsEventhandlerFacade - scenario : Metadata update received for trailer ${newOapAsset.trailerId}`);
      const oapAssetToUpdate = { ...dbOapAsset, isMetadataUpdateRequired: true };
      await addOrUpdateOapAsset(oapAssetToUpdate, functionName);
      return oapAssetToUpdate;
    }
  }
};
