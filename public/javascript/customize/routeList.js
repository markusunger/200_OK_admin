import { html } from '../preact-htm.js';

export default function routeList({ routes }) {
  return html`
    <div class="column is-one-third">
      <div class="box config-list-container">
        <p class="config-list-title">Select Custom Route</p>
        <ul class="config-list">
          ${routes.map(route => html`<li>${route.path}</li>`)}
        </ul>
        <button class="button is-primary is-fullwidth">
          <span class="icon">
            <i class="fas fa-plus-square"></i>
          </span>
          <span>New Custom Route</span>
        </button>
      </div>
    </div>
  `;
}
