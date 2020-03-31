import RequestColumn from './requestColumn.js';
import ResponseColumn from './responseColumn.js';

import { html } from '../preact-htm.js';

export default function EventContainer({ event }) {
  return html`
    <div class="column">
      <${RequestColumn} request=${event.request} />
      <${ResponseColumn} response=${event.response} />
    </div>
  `;
}
