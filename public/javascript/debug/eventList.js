/* eslint-disable */

import { html, useEffect, useRef } from '../preact-htm.js';

export default function EventList({ eventList, selectedEvent, clickEvent }) {
  const containerRef = useRef(null);
  
  useEffect(() => {
    const container = containerRef.current || null;
    if (container) container.scrollTo(container.scrollHeight);
  });

  return html`
    <div class="column is-one-third">
      <div class="box event-list-container" ref=${containerRef}>
        <p class="event-list-title">Select Request</p>
        <ul class="event-list">
          ${eventList.map(event => html`<li onClick=${clickEvent}>${event.request.method} ${event.request.target}</li>`)}
        </ul>
      </div>
    </div>
  `;
}
