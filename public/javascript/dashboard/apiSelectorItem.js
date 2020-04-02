import { html } from '../preact-htm.js';

export default function ApiSelectorItem({ api, active, selectClickHandler }) {
  return html`
    <a class="panel-block api-link ${active ? 'is-active' : ''}" data-api=${api} onClick=${selectClickHandler}>
      <span class="panel-icon">
        <i class="fas fa-database" aria-hidden="true"></i>
      </span>
      <span class="api-name">${api}</span>
    </a>
  `;
}
