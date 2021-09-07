import { JSONSchemaType } from 'ajv';
import { iTrailer, iXmlDataSource } from 'src/types/XmlDataSource';

/**
 * template for trailers schema, will be extended for each country be to validate promotedChannel
 */
const TrailerSchema: JSONSchemaType<iTrailer> = {
  $id: 'Trailer',
  type: 'object',
  properties: {
    id: { type: 'string', isNotEmpty: true },
    title: { type: 'string' },
    disclaimer: { type: 'string', nullable: true },
    branding: { type: 'string', nullable: true },
    mediaAsset: { type: 'string' },
    mediaID: { type: 'string', nullable: true },
    showTitle: { type: 'string' },
    promotedChannel: { type: 'string' },
    duration: { type: 'string' },
    versionType: { type: 'string', nullable: true },
    seasonNumber: { type: 'string', nullable: true },
    episodeNumber: { type: 'string', nullable: true },
    associatedFiles: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          videoFile: { type: 'string' },
          audioFile: { type: 'string' },
          outputFilename: { type: 'string' },
          sponsorTail: { type: 'string', nullable: true },
          keyartOrImage: { type: 'string', nullable: true },
          titleArt: { type: 'string', nullable: true },
        },
        required: ['videoFile', 'audioFile', 'outputFilename'],
        additionalProperties: true,
      },
    },
  },
  required: ['id', 'title', 'mediaAsset', 'showTitle', 'promotedChannel', 'duration'],
  additionalProperties: true,
};

/**
 * each country have a different allowed promotedChannel list to validate
 */
const NorwayTrailerSchema = { ...TrailerSchema, $id: 'NorwayTrailer', properties: { ...TrailerSchema.properties, promotedChannel: { type: 'string', enum: ['tvn', 'fem', 'max', 'vox', 'esn', 'dp', 'es1', 'es2'] } } };
const DenmarkTrailerSchema = { ...TrailerSchema, $id: 'DenmarkTrailer', properties: { ...TrailerSchema.properties, promotedChannel: { type: 'string', enum: ['k4', 'k5', 'k6', 'c9', 'dp', 'es1', 'es2'] } } };
const SwedenTrailerSchema = { ...TrailerSchema, $id: 'SwedenTrailer', properties: { ...TrailerSchema.properties, promotedChannel: { type: 'string', enum: ['k5', 'k9', 'k11', 'dp', 'es1', 'es2'] } } };
const FinlandTrailerSchema = { ...TrailerSchema, $id: 'FinlandTrailer', properties: { ...TrailerSchema.properties, promotedChannel: { type: 'string', enum: ['tv5', 'frii', 'kut', 'dp', 'es1', 'es2'] } } };

/**
 * Main validation object, apply different trailer schema to validate, depends on country code
 */
export const XmlDataSourceSchema: JSONSchemaType<iXmlDataSource> = {
  $id: 'XmlDataSource',
  type: 'object',
  properties: {
    trailers: {
      type: 'object',
      discriminator: { propertyName: 'countryCode' }, // https://ajv.js.org/json-schema.html#discriminator
      oneOf: [
        {
          properties: {
            countryCode: { const: 'NO' },
            username: { type: 'string' },
            trailer: { type: 'array', minItems: 1, items: NorwayTrailerSchema },
          },
        },
        {
          properties: {
            countryCode: { const: 'DK' },
            username: { type: 'string' },
            trailer: { type: 'array', minItems: 1, items: DenmarkTrailerSchema },
          },
        },
        {
          properties: {
            countryCode: { const: 'SE' },
            username: { type: 'string' },
            trailer: { type: 'array', minItems: 1, items: SwedenTrailerSchema },
          },
        },
        {
          properties: {
            countryCode: { const: 'FI' },
            username: { type: 'string' },
            trailer: { type: 'array', minItems: 1, items: FinlandTrailerSchema },
          },
        },
      ],
      required: ['countryCode', 'username', 'trailer'],
      additionalProperties: true,
    },
  },
  required: ['trailers'],
  additionalProperties: true,
};
