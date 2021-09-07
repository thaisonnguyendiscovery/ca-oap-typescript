import LOG from 'src/utils/Logger';
import path from 'path';
import i18n from 'i18n';

const i18nConfig = {
  locales: ['NO', 'DK', 'SE', 'FI', 'MAP'],
  defaultLocale: 'NO',
  directory: path.join(__dirname, '/locales'),
  autoReload: true,
  updateFiles: false,
  // logDebugFn: (msg: string) => {
  //   LOG.trace('i18n trace: ', msg);
  // },
};

LOG.trace('I18n dirname: ', path.join(__dirname, '/locales'));
i18n.configure(i18nConfig);

/**
 * Set a fix default locale to the current execution context, the subsequent translate call will use this locale value
 *
 * @param defaultLocale
 *      Default locale String
 */
export const setDefaultLocale = (defaultLocale: string): void => {
  i18n.configure({ ...i18nConfig, defaultLocale });
};

/**
 * Translate text to default locale
 * @param text
 *    the text need too be translated
 * @param parameters
 *    i18n paramters
 * @returns
 *    the translated string
 */
export const translate = (text: string): string => {
  const result = i18n.__(text);
  return result === text ? '' : result;
};

/**
 * translate text into target locale
 *
 * @param phrase
 *    the text need too be translated
 * @param locale
 *    the locale code
 * @returns
 *    the translated string
 */
export const translateToLocale = (phrase?: string, locale?: string): string => {
  if (!phrase || !locale) {
    return '';
  }
  const result = i18n.__({ phrase, locale });

  return result === phrase ? '' : result;
};

/**
 *  Map value to another value defined in the MAP.json
 *
 * @param key
 *    key want to map
 * @param defaultValue
 *    default value if key not found
 * @returns
 *    string of the mapped value
 */
export const mapValue = (key: string, defaultValue?: string): string => translateToLocale(key, 'MAP') || defaultValue || '';
