import { sendMessageToIconikQueue } from 'src/handlers/helpers/SqsEventHandlerHelper';
import * as SqsService from 'src/services/SqsService';

describe('SqsEventHandlerHelper test', () => {
  it('should thow error when sendMessageToIconikQueue without environment variable', () => {
    expect(() => sendMessageToIconikQueue([], '123')).toThrow(Error('Configuration error! process.env.OAP_ICONIK_QUEUE_URL is empty.'));
  });

  it('should send message to iconik queue', async () => {
    process.env.OAP_ICONIK_QUEUE_URL = 'dummy-url';
    jest.spyOn(SqsService, 'sendMessageQueue').mockReturnValue(Promise.resolve('OK'));

    const result = await sendMessageToIconikQueue([], '123');
    expect(result).toBe('OK');
  });
});
