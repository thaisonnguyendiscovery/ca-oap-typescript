import { iXmlDataSource } from 'src/types/XmlDataSource';
import Ajv, { ErrorObject } from 'ajv';
import { XmlDataSourceSchema } from 'src/types/schema/XmlDataSourceSchema';

const ajv = new Ajv({ allErrors: true, discriminator: true });

ajv.addKeyword({
  keyword: 'isNotEmpty',
  type: 'string',
  schemaType: 'boolean',
  validate: (_schema: any, data: any) => {
    return typeof data === 'string' && data.trim() !== '';
  },
  error: {
    message: 'value cannot be empty',
  },
});

const validate = ajv.compile(XmlDataSourceSchema);

/**
 * validate the xmlDatasource object againts the schema
 *
 * @param xmlDataSource
 *      iXmlDataSource object
 * @returns
 *      Error(s) if any
 */
export const validateSchema = (xmlDataSource: iXmlDataSource): ErrorObject<string, Record<string, iXmlDataSource>, unknown>[] | null | undefined => {
  const isValid = validate(xmlDataSource);
  if (!isValid) {
    return validate.errors;
  }
  return [];
};
