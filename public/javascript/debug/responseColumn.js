import { html } from '../preact-htm.js';

export default function ResponseColumn({ response }) {
  return html`
    <div>
    <h2 class="title is-3">Status ${response.status}</p>
    <h3 class="title is-6 spacing-top">Headers</h3>
    <pre>${JSON.stringify(response.headers, null, 4)}</pre>
    <h3 class="title is-6 spacing-top">Body</h3>
    <pre>${JSON.stringify(response.body, null, 4)}</pre>
    </div>
  `;
}
