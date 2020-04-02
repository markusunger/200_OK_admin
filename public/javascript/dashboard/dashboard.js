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
