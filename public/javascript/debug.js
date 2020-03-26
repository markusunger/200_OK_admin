/* eslint-disable */

import { html, render, useState } from './preact-htm.js';

const mountPoint = document.getElementById('debug-container');
const apiName = mountPoint.dataset.apiName;

function DebugApp() {
  const [ requests, setRequests ] = useState([]);
  const sse = new EventSource(`/api/debug-stream/${apiName}`);

  sse.addEventListener('message', (e) => {
    setRequests([...requests, e.data]);
  });

  return html`
    <p>${requests[requests.length - 1]}</p>
  `;
}

render(html`<${DebugApp} />`, mountPoint);

// function handleDebug() {
//   // eslint-disable-next-line no-undef
//   const sse = new EventSource(`/api/debug-stream/${apiName}`);
//   const debugBox = document.getElementById('debug-box');

//   sse.addEventListener('message', (e) => {
//     console.log(e);
//     debugBox.innerHTML = `<p>${e.data}</p>`;
//   });
// }

// if (document.readyState === 'loading') {
//   document.addEventListener('DOMContentLoaded', handleDebug);
// } else {
//   handleDebug();
// }
