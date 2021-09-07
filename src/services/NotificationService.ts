import LOG from 'src/utils/Logger';

/**
 * Send slack message with a predefined header and body
 *
 * @param header
 *    message header
 * @param body
 *    message body
 * @param time
 *    message time
 * @returns
 *    json response from slack endpoint
 */
export const sendSlackMessage = async (header: string, body: string, time: string): Promise<any> => {
  if (!process.env.OAP_SLACK_WEBHOOK_SUCCESS) {
    LOG.error('sendSlackMessage - process.env.OAP_SLACK_WEBHOOK_SUCCESS is empty');
    throw new Error('process.env.oapSlackWebhookSuccess is empty');
  }

  const slackMessage = generateSlackMessage(header, body, time);

  const slackResponse = await fetch(process.env.OAP_SLACK_WEBHOOK_SUCCESS, {
    method: 'POST',
    body: JSON.stringify(slackMessage),
  }).then((res) => res.json());
  LOG.trace(`sendSlackMessage: header: ${header}, body: ${body} => response: ${slackResponse}`);
  return `sendSlackMessage with header: ${header}, body: ${body} successfully`;
};

/**
 * Generate slack message json structure
 *
 * @param header
 *      message header
 * @param message
 *      message body
 * @param time
 *      message time
 * @returns
 *    `message json
 */
const generateSlackMessage = (header: string, message: string, time: string) => {
  return {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: header,
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: message,
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'context',
        elements: [
          {
            type: 'plain_text',
            text: 'Created At: ' + time,
            emoji: true,
          },
        ],
      },
    ],
  };
};
