import { html } from '../preact-htm.js';

export default function ErrorBox({ error }) {
  return html`
    <div class="notification is-warning">
      ${error}
    </div>
  `;
}
