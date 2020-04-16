/* eslint-disable */

import EventListItem from './eventListItem.js';

import { html, useEffect, useRef } from '../preact-htm.js';

export default function EventList({ eventList, selectedEvent, clickEvent }) {
  const containerRef = useRef(null);
  
  useEffect(() => {
    const container = containerRef.current || null;
    if (container) container.scrollTo(0, container.scrollHeight);
  }, [eventList]);

  return html`
    <div class="column is-one-third">
      <div class="box config-list-container" ref=${containerRef}>
        <p class="config-list-title">Select Request</p>
        <ul class="config-list">
          ${eventList.map((event, idx) => html`<${EventListItem} clickEvent=${clickEvent} key=${event.timeStamp} event=${event} selectedClass=${idx === selectedEvent ? 'is-selected-event' : ''} />`)}
        </ul>
      </div>
    </div>
  `;
}
