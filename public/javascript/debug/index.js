/* eslint-disable */

import useSSE from './useSSE.js';
import EventList from './eventList.js';
import EventContainer from './eventContainer.js';

import {
  html,
  render,
  useState,
  useEffect,
} from '../preact-htm.js';

const mountPoint = document.getElementById('debug-container');
const { apiName } = mountPoint.dataset;

function Debug() {
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState(0);

  // click handler for EventList
  const clickEvent = (id) => {
    setSelected(id);
  }

  const data = useSSE(apiName);
  useEffect(() => {
    if (data) setEvents([...events, data]);
  }, [data]);

  if (events.length === 0) {
    return html`
      <div>Issue requests to your API to see them here.</div>
    `;
  } else {
    return html`
      <div class="columns">
        <${EventList} eventList=${events} selectedEvent=${selected} clickEvent=${clickEvent} />
        <${EventContainer} event=${events[selected]} />
      </div>
    `;
  }
}

render(html`<${Debug} />`, mountPoint);
