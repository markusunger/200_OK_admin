import { html } from '../preact-htm.js';

export default function RequestColumn({ request }) {
  return html`
    <div>
      <h2 class="title is-4">Request</h2>
      <p>${JSON.stringify(request)}</p>
    <div>
  `;
}
