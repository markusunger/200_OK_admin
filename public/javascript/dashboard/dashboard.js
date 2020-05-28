import ApiSelector from './apiSelector.js';
import ApiInfo from './apiInfo.js';

import { html, useState } from '../preact-htm.js';

export default function Dashboard({ apiList }) {
  const [selectedApi, setSelectedApi] = useState(apiList[0]);

  const onSelectApi = (e) => {
    let { api } = e.currentTarget.dataset;
    if (!apiList.includes(api)) [api] = apiList;
    setSelectedApi(api);
  };

  if (apiList.length === 0) {
    return html`
      <div class="box">
        <p>Currently, you do not have an API connected to your account.</p>
        <a class="button is-primary is-outlined is-fullwidth spacing-top" href="/connect">
          <span class="icon is-large">
            <i class="fas fa-plug"></i>
          </span>
          <span>Connect another API</span>
        </a>

        <a class="button is-primary is-fullwidth spacing-top" href="/dashboard/create">
          <span class="icon is-large">
            <i class="fas fa-plus-square"></i>
          </span>
          <span>Create a new API</span>
        </a>
      </div>
    `;
  }

  return html`
    <div class="columns is-desktop">
      <div class="column">
        <${ApiSelector} apiList=${apiList} selectedApi=${selectedApi} selectClickHandler=${onSelectApi} />
      </div>
      <div class="column">
        <${ApiInfo} selectedApi=${selectedApi} />
      </div>

    </div>
  `;
}
