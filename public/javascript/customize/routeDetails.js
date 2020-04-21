import { html, useState, useEffect } from '../preact-htm.js';

import MethodResponse from './methodResponse.js';

// default values for a null route
const defaultPath = '/';
const defaultData = {
  GET: {
    'new-key': 'new-value',
  },
};

export default function routeDetails({ route, apiName, clickSaveHandler }) {
  // separate states for path and custom responses
  const [path, setPath] = useState(route ? route.path : defaultPath);
  const [responses, setResponses] = useState(route ? route.data : defaultData);
  const [isReady, setIsReady] = useState(true);

  // change path and responses as soon as route prop changes
  useEffect(() => {
    setPath(route ? route.path : '/');
    setResponses(route ? route.data : { GET: {} });
  }, [route]);

  // change handler for path input field
  const updatePath = (e) => {
    const { value } = e.target;
    setPath(value);
  };

  // change handler for JSON textareas inside each MethodResponse,
  // merges updated field into existing state object
  const updateResponse = (type, updated, isValid) => {
    if (!isValid) {
      setIsReady(false);
      return;
    }
    setIsReady(true);
    setResponses({
      ...responses,
      ...{ [type]: updated },
    });
  };

  // local save handler that compiles entered information, validates it
  // and then calls the route save handler passed down from the parent
  const saveClick = () => {
    clickSaveHandler(path, route.path, responses);
  };

  return html`
    <div class="column">
      <div class="box">
        <h2 class="title">
          ${path.length === 0 ? 'New Route' : html`Custom Route for <code>${path}</code>`}
        </h2>

        <label class="label">endpoint path</label>
        <div class="field has-addons">
          <div class="control">
            <a class="button is-static">
              https://${apiName}.200ok.app
            </a>
          </div>
          <div class="control is-expanded">
            <input class="input" type="text" placeholder="e.g. /logout" onInput=${updatePath} value="${path}" />
          </div>
        </div>

        <hr />
        <${MethodResponse} type='GET' data=${responses.GET} updateResponse=${updateResponse} />
        <hr />
        <${MethodResponse} type='POST' data=${responses.POST} updateResponse=${updateResponse} />
        <hr /> 
        <${MethodResponse} type='PUT' data=${responses.PUT} updateResponse=${updateResponse} />
        <hr /> 
        <${MethodResponse} type='DELETE' data=${responses.DELETE} updateResponse=${updateResponse} />
        <hr />

        <div class="field is-grouped">
          <p class="control">
            <button class="button is-primary" onClick=${saveClick} disabled=${!isReady}>
              <span class="icon is-small">
                <i class="fas fa-save"></i>
              </span>
              <span>
                Save Changes
              </span>
            </button>
          </p>
          <p class="control">
            <a class="button is-danger">
              <span class="icon is-small">
                <i class="fas fa-ban"></i>
              </span>
              <span>
              Delete Route
              </span>
            </a>
          </p>
        </div>

      </div>
    </div>
  `;
}
