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
        <p class="information">
          You can try this out by issuing the following <code>curl</code> instruction in your command line:
        </p>
        <pre class="code-block">
          curl https://${apiName}.200ok.app/test-route
        </pre>
        <p class="information">
          Or find more information about how to use your API in the <a href="/documentation">documentation</a>.
        </p>
      </div>
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
