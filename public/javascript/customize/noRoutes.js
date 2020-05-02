import { html, useContext } from '../preact-htm.js';

import ApiName from './apiNameContext.js';

export default function NoRoutes() {
  const apiName = useContext(ApiName);

  return html`
    <div class="column">
      <div class="box">
        <p>There are currently no custom routes for <code>${apiName}</code>. You can create a new one
        by clicking the "New Custom Route" buton on the left.</p>
      </div>
    </div>
  `;
}
