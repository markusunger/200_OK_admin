import ApiSelectorItem from './apiSelectorItem.js';

import { html } from '../preact-htm.js';

export default function ApiSelector({ apiList, selectedApi, selectClickHandler }) {
  return html`
    <nav class="panel is-link">
      <p class="panel-heading">
        Your APIs
      </p>
    
      ${apiList.map(api => html`<${ApiSelectorItem} key=${api} api=${api} active=${selectedApi === api} selectClickHandler=${selectClickHandler} />`)}
      
      <div class="panel-block">
        <a class="button is-link is-outlined is-fullwidth" href="/connect">
          <span class="icon is-large">
            <i class="fas fa-plug"></i>
          </span>
          <span>Connect an API</span>
        </a>
      </div>
    </nav>
  `;
}
