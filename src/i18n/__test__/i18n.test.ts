import { mapValue, setDefaultLocale, translate, translateToLocale } from 'src/i18n/i18n';

describe('I18n test', () => {
  it('should translate to a specific locale', async () => {
    const norway = translateToLocale('countryName', 'NO');
    expect(norway).toBe('Norway');

    const empty1 = translateToLocale('', 'NO');
    expect(empty1).toBe('');

    const empty2 = translateToLocale('countryName', '');
    expect(empty2).toBe('');

    const empty3 = translateToLocale('this-should-not-exist', 'this-should-not-exist');
    expect(empty3).toBe('');
  });

  it('should set default locale and translate', async () => {
    setDefaultLocale('NO');
    const norway = translate('countryName');
    expect(norway).toBe('Norway');

    setDefaultLocale('FI');
    const finland = translate('countryName');
    expect(finland).toBe('Finland');

    const empty = translate('this-should-not-exist');
    expect(empty).toBe('');
  });

  it('should map value', async () => {
    expect(mapValue('channel2template_dp')).toBe('DPlus');
    expect(mapValue('this-should-not-exist')).toBe('');
    expect(mapValue('this-should-not-exist', 'MY DEFAULT')).toBe('MY DEFAULT');
  });
});
