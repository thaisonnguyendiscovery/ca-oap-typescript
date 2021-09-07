import { sendSlackMessage } from 'src/services/NotificationService';
describe('NotificationService Test', () => {
  it('should throw exception if not configured correctly', async () => {
    await expect(sendSlackMessage('header', 'body', '10')).rejects.toThrow(Error);
  });
  it('should send slack message', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({}),
    });
    process.env.OAP_SLACK_WEBHOOK_SUCCESS = 'mock-end-point';

    const res = await sendSlackMessage('mockHeader', 'mockBody', '10');
    expect(res).toEqual(`sendSlackMessage with header: mockHeader, body: mockBody successfully`);
  });
});
