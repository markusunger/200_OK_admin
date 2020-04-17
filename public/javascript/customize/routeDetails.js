import { html } from '../preact-htm.js';

export default function routeDetails({ route, apiName }) {
  const { path, data } = route || {};
  const {
    GET,
    POST,
    PUT,
    DELETE
  } = data || {};

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
        <h2 class="title">Custom Route</h2>

        <label class="label">endpoint path</label>
        <div class="field has-addons">
          <div class="control">
            <a class="button is-static">
              https://${apiName}.200ok.app
            </a>
          </div>
          <div class="control is-expanded">
            <input class="input" type="text" placeholder="e.g. /logout" value="${path}" />
          </div>
        </div>

        <hr />

        <div class="field">
          <div class="control">
            <label class="checkbox">
              <input type="checkbox" checked=${!!GET} /> Allow GET requests
            </label>
          </div>
        </div>

        <div class="field">
          <label class="label">JSON response to GET</label>
          <div class="control">
            <textarea class="textarea" placeholder="enter JSON here">${JSON.stringify(GET, null, 2)}</textarea>
          </div>
        </div>

      </div>
    </div>
  `;
}
