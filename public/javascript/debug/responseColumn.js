import { html } from '../preact-htm.js';

export default function ResponseColumn({ response }) {
  return html`
    <div>
      <h2 class="title is-4">Response</h2>
      <p>${JSON.stringify(response)}</p>
    </div>
  `;
}
