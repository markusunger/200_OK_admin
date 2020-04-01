import { html } from '../preact-htm.js';

export default function RequestColumn({ request }) {
  return html`
    <div>
      <p>${request.method} <code>${request.target}</code></p>
      <h3 class="title is-6 spacing-top">Headers</h3>
      <pre>${JSON.stringify(request.headers, null, 4)}</pre>
      <h3 class="title is-6 spacing-top">Body</h3>
      <pre>${JSON.stringify(request.body, null, 4)}</pre>
    </div>
  `;
}
