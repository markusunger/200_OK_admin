import { html } from '../preact-htm.js';

export default function EventListItem({ event, selectedClass, clickEvent }) {
  return html`
    <li class=${selectedClass} onClick=${clickEvent} data-timestamp=${event.timestamp}>${event.request.method} ${event.request.target}</li>
  `;
}
