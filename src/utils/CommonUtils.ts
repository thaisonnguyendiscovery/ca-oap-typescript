/**
 * Flatten the object converted from xml file
 *
 * @param object
 *      XmlJs object from xml file
 * @returns
 *      flatten object
 */
export const flattenObject = (object: any): any => {
  if (typeof object === 'string') {
    return object.replace('\n', '').trim();
  } else if (Array.isArray(object)) {
    return object.reduce((accumulator, value) => (typeof value === 'string' ? value : [...accumulator, flattenObject(value)]), []);
  } else if (typeof object === 'object') {
    let result = {};
    Object.keys(object).forEach((key) => {
      const value = object[key];
      if (key === '$' && typeof value === 'object') {
        result = { ...result, ...value };
      } else {
        result[key] = flattenObject(value);
      }
    });
    return result;
  }
  return object;
};
