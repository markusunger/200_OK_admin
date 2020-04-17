import { html, useState } from '../preact-htm.js';

import MethodResponse from './methodResponse.js';

export default function routeDetails({ route, apiName }) {
  const [hasThisPath, setPath] = useState(route ? route.path : '/');

  const { data } = route || {};
  const {
    GET,
    POST,
    PUT,
    DELETE,
  } = data || {};

  const updatePath = (e) => {
    const { value } = e.target;
    setPath(value);
  };

  if (!route) {
    return html`
      <div class="column">
        <div class="box">
          <h2 class="title">No Route Selected</h2>
          <p>Pick a custom route from the list on the left or create a new one by 
          clicking the button there.</p>
        </div>
      </div>
    `;
  }

  return html`
    <div class="column">
      <div class="box">
        <h2 class="title">Custom Route for <code>${hasThisPath}</code></h2>

        <label class="label">endpoint path</label>
        <div class="field has-addons">
          <div class="control">
            <a class="button is-static">
              https://${apiName}.200ok.app
            </a>
          </div>
          <div class="control is-expanded">
            <input class="input" type="text" placeholder="e.g. /logout" onInput=${updatePath} value="${hasThisPath}" />
          </div>
        </div>

        <hr />
        <${MethodResponse} type='GET' data=${GET} />
        <hr />
        <${MethodResponse} type='POST' data=${POST} />
        <hr /> 
        <${MethodResponse} type='PUT' data=${PUT} />
        <hr /> 
        <${MethodResponse} type='DELETE' data=${DELETE} />
        <hr />

        <div class="field is-grouped">
          <p class="control">
            <a class="button is-primary">Save Changes</a>
          </p>
          <p class="control">
            <a class="button is-danger">Delete Route</a>
          </p>
        </div>

      </div>
    </div>
  `;
}
