import { flattenObject } from 'src/utils/CommonUtils';

describe('CommonUtils Test', () => {
  it('should flatten object', async () => {
    const input = {
      trailers: {
        $: {
          countryCode: 'FI',
          username: 'Peter Rothoff Hojholt',
        },
        nan: NaN,
        trailer: [
          {
            $: {
              id: '109238745600001',
            },
            title: ['X tv5_Qa Shows_s03_e08_30_seasonprem_Monday_20:30_streamalleps'],
            mediaAsset: ['FI109238745600001'],
            mediaID: ['729939_1'],
            showTitle: ['Qa Shows'],
            promotedChannel: ['tv5'],
            duration: ['30'],
            versionType: ['Monday'],
            seasonNumber: ['3'],
            episodeNumber: ['8'],
            associatedFiles: [
              {
                videoFile: ['tv5_FI109238745600001_30.mxf'],
                audioFile: ['tv5_FI109238745600001_Monday_30.wav'],
                outputFilename: ['FI109238745600001_X_tv5_Qa_Shows_s03_e08_30_seasonprem_Monday_20:30_streamalleps.mxf'],
                sponsorTail: [''],
                keyartOrImage: ['Qa_Shows_s03_image.jpg'],
                titleArt: ['Qa_Shows_s03_titleart.png'],
              },
            ],
          },
        ],
      },
    };

    const output = flattenObject(input);
    expect(output).toEqual({
      trailers: {
        countryCode: 'FI',
        username: 'Peter Rothoff Hojholt',
        nan: NaN,
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
                outputFilename: 'FI109238745600001_X_tv5_Qa_Shows_s03_e08_30_seasonprem_Monday_20:30_streamalleps.mxf',
                sponsorTail: '',
                keyartOrImage: 'Qa_Shows_s03_image.jpg',
                titleArt: 'Qa_Shows_s03_titleart.png',
              },
            ],
          },
        ],
      },
    });
  });
});
