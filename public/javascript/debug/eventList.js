/* eslint-disable */

import { html } from '../preact-htm.js';

export default function EventList({ eventList, selectedEvent, clickEvent }) {
  return html`
    <div class="column">
      <aside class="menu">
        <p class="menu-label">
          Select Request
        </p>
        <ul class="menu-list">
          ${eventList.map(event => html`<li onClick=${() => clickEvent()}><a>${event.request.method} ${event.request.target}</a></li>`)}
        </ul>
      </aside>
    </div>
  `;
}
