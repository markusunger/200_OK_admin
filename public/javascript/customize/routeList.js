import { html } from '../preact-htm.js';

export default function routeList({
  routes,
  clickItemHandler,
  clickNewHandler,
  selectedRoute,
}) {
  return html`
    <div class="column is-one-third">
      <div class="box config-list-container">
        <p class="config-list-title">Select Custom Route</p>
        <ul class="config-list">
          ${routes.map((route, idx) => html`<li 
            onClick=${clickItemHandler} 
            key=${route.path} 
            data-route=${route.path} 
            class=${(selectedRoute === idx) ? 'is-selected-item' : ''}>
              ${route.path}
          </li>`)}
        </ul>
        <button class="button is-primary is-fullwidth spacing-top" onClick=${clickNewHandler}>
          <span class="icon">
            <i class="fas fa-plus-square"></i>
          </span>
          <span>New Custom Route</span>
        </button>
      </div>
    </div>
  `;
}
