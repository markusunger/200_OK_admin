import { html } from '../preact-htm.js';

export default function ErrorDisplay({ errors }) {
  console.log(typeof errors);
  return html`
    <div class="notification is-warning is-light">
      ${errors.map(error => html`<p>${error}</p>`)}
    </div>
  `;
}
