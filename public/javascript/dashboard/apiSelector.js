import ApiSelectorItem from './apiSelectorItem.js';

import { html } from '../preact-htm.js';

export default function ApiSelector({ apiList, selectedApi, selectClickHandler }) {
  return html`
    <nav class="panel is-primary">
      <p class="panel-heading">
        Your APIs
      </p>
    
      ${apiList.map(api => html`<${ApiSelectorItem} key=${api} api=${api} active=${selectedApi === api} selectClickHandler=${selectClickHandler} />`)}
      
      <div class="panel-block">
        <a class="button is-primary is-outlined is-fullwidth" href="/connect">
          <span class="icon is-large">
            <i class="fas fa-plug"></i>
          </span>
          <span>Connect another API</span>
        </a>
      </div>

      <div class="panel-block">
        <a class="button is-primary is-fullwidth" href="/dashboard/create">
          <span class="icon is-large">
            <i class="fas fa-plus-square"></i>
          </span>
          <span>Create a new API</span>
        </a>
      </div>
    </nav>
  `;
}
