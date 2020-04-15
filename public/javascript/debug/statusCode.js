import { html } from '../preact-htm.js';

export default function StatusCode({ status }) {
  const codeMessages = {
    200: 'OK',
    201: 'Created',
    204: 'No Content',
    301: 'Moved Permanently',
    304: 'Not Modified',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    415: 'Unsupported Media Type',
    429: 'Too Many Requests',
    500: 'Internal Server Error',
  };

  let style = 'ok';
  if (status >= 300 && status < 400) style = 'redirect';
  if (status >= 400 && status < 500) style = 'client-error';
  if (status >= 500) style = 'server-error';

  return html`
    <div class="${style} status-code is-pulled-right">${status} ${codeMessages[status] || ''}</div>
  `;
}
