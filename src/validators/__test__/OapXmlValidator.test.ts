import { validateSchema } from 'src/validators/OapXmlValidator';

describe('OapXmlValidator Test', () => {
  it('should validate a valid object', () => {
    const input = {
      trailers: {
        countryCode: 'FI',
        username: 'Peter Rothoff Hojholt',
        trailer: [
          {
            id: '109238745600001',
            title: 'X tv5_Qa Shows_s03_e08_30_seasonprem_Monday_20:30_streamalleps',
            mediaAsset: 'FI109238745600001',
            mediaID: '729939_1',
            showTitle: 'Qa Shows',
            promotedChannel: 'tv5',
            duration: '30',
            versionType: 'Monday',
            seasonNumber: '3',
            episodeNumber: '8',
            associatedFiles: [
              {
                videoFile: 'tv5_FI109238745600001_30.mxf',
                audioFile: 'tv5_FI109238745600001_Monday_30.wav',
                outputFilename: 'FI109238745600001_X_tv5_Qa_Shows_s03_e08_30_seasonprem_Monday_20:30_streamalleps.mxf\n            ',
                sponsorTail: '',
                keyartOrImage: 'Qa_Shows_s03_image.jpg',
                titleArt: 'Qa_Shows_s03_titleart.png',
              },
            ],
          },
        ],
      },
    };
    expect(validateSchema(input)?.length).toBe(0);
  });

  it('should validate an invalid object', () => {
    expect(validateSchema({} as any)?.length).toBeGreaterThan(0);
  });

  it('discriminator test', () => {
    const input = {
      trailers: {
        countryCode: 'DK',
        username: 'Peter Rothoff Hojholt',
        trailer: [
          {
            id: '',
            title: 'X tv5_Qa Shows_s03_e08_30_seasonprem_Monday_20:30_streamalleps',
            mediaAsset: 'FI109238745600001',
            mediaID: '729939_1',
            showTitle: 'Qa Shows',
            promotedChannel: 'tv5',
            duration: '30',
            versionType: 'Monday',
            seasonNumber: '3',
            episodeNumber: '8',
            associatedFiles: [
              {
                videoFile: 'tv5_FI109238745600001_30.mxf',
                audioFile: 'tv5_FI109238745600001_Monday_30.wav',
                outputFilename: 'FI109238745600001_X_tv5_Qa_Shows_s03_e08_30_seasonprem_Monday_20:30_streamalleps.mxf\n            ',
                sponsorTail: '',
                keyartOrImage: 'Qa_Shows_s03_image.jpg',
                titleArt: 'Qa_Shows_s03_titleart.png',
              },
            ],
          },
        ],
      },
    };

    const result = validateSchema(input);
    expect(result?.length).toBe(2);
  });
});
