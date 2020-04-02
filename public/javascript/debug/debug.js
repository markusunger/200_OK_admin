/* eslint-disable */

import useSSE from './useSSE.js';
import EventList from './eventList.js';
import EventContainer from './eventContainer.js';

import {
  html,
  useState,
  useEffect,
} from '../preact-htm.js';

export default function Debug({ apiName }) {
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState(0);

  // click handler for EventListItem
  const clickEvent = (e) => {
    const timestamp = parseInt(e.target.getAttribute('data-timestamp'), 10);
    let idx = events.findIndex(event => event.timestamp === timestamp);
    if (idx < 0) idx = 0;
    setSelected(idx);
  }

  const data = useSSE(apiName);
  useEffect(() => {
    if (data) setEvents([...events, data]);
  }, [data]);

  if (events.length === 0) {
    return html`
      <div class="box">
        <h2 class="title is-4">As soon as you make requests to your API <em>${apiName}</em>,
        they will appear here.</h2>
        <a href="/dashboard">Back to dashboard</a>
      </div>
    `;
  } else {
    return html`
      <div>
        <a href="/dashboard">Back to dashboard</a>
      </div>
      <div class="columns">
        <${EventList} eventList=${events} selectedEvent=${selected} clickEvent=${clickEvent} />
        <${EventContainer} event=${events[selected]} />
      </div>
    `;
  }
}
