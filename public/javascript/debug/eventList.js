import EventListItem from './eventListItem.js';

import { html, useEffect, useRef } from '../preact-htm.js';

export default function EventList({
  eventList, selectedEvent, clickEvent, flushHandler,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current || null;
    if (container) container.scrollTo(0, container.scrollHeight);
  }, [eventList]);

  return html`
    <div class="column is-one-third">
      <div class="box config-list-container" ref=${containerRef}>
        <p class="information">
          <button class="button is-danger is-fullwidth" onClick=${flushHandler}>
            <span class="icon">
              <i class="fas fa-eraser" aria-hidden="true"></i>
            </span>
            <span>Empty Request List</span>
          </button>
        </p>
        <p class="config-list-title">Select Request</p>
        <div class="config-list-container-list">
          <ul class="config-list">
            ${eventList.map((event, idx) => html`<${EventListItem} clickEvent=${clickEvent} key=${event.timeStamp} event=${event} selectedClass=${idx === selectedEvent ? 'is-selected-item' : ''} />`)}
          </ul>
        </div>
      </div>
    </div>
  `;
}
