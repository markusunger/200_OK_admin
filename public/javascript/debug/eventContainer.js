/* eslint-disable import/extensions */

import RequestColumn from './requestColumn.js';
import ResponseColumn from './responseColumn.js';

import { html, useState } from '../preact-htm.js';

export default function EventContainer({ event }) {
  const [selectedTab, setSelectedTab] = useState('request');

  const setRequest = () => setSelectedTab('request');
  const setResponse = () => setSelectedTab('response');

  return html`
    <div class="column">
      <div class="box">
        <div class="tabs is-medium">
          <ul>
            <li class=${selectedTab === 'request' ? 'is-active' : ''} onClick=${setRequest}><a>
              <span class="icon is-medium"><i class="fas fa-upload" aria-hidden="true"></i></span>
              <span>Request</span>
            </a></li>
            <li class=${selectedTab === 'response' ? 'is-active' : ''} onClick=${setResponse}><a>
              <span class="icon is-medium"><i class="fas fa-download" aria-hidden="true"></i></span>
              <span>Response</span>
            </a></li>
          </ul>
        </div>
        ${selectedTab === 'request'
          ? html`<${RequestColumn} request=${event.request} />`
          : html`<${ResponseColumn} response=${event.response} />`
        }
      </div>
    </div>
  `;
}
