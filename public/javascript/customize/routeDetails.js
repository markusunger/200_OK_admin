import {
  html, useState, useEffect, useReducer, useContext,
} from '../preact-htm.js';

import validateRouteInformation from './routeValidation.js';
import MethodResponse from './methodResponse.js';
import ErrorDisplay from './errorDisplay.js';
import ApiName from './apiNameContext.js';
import {
  stateReducer, initialStateReducer, validJsonReducer, initialValidJsonReducer,
} from './routeDetailsReducer.js';

export default function routeDetails({ route, clickSaveHandler, clickDeleteHandler }) {
  const apiName = useContext(ApiName);
  const [errors, setErrors] = useState(null);

  // reducers for both method response state and validity of those response
  const [state, stateDispatch] = useReducer(
    stateReducer, initialStateReducer(route.path, route.data),
  );
  const [validJson, validJsonDispatch] = useReducer(
    validJsonReducer, initialValidJsonReducer(),
  );

  // change path and responses as soon as route prop changes
  useEffect(() => {
    stateDispatch({
      op: 'UPDATE_ALL_METHODS',
      path: route.path,
      data: route.data,
    });
    setErrors(null);
  }, [route]);

  // local save handler that compiles entered information, validates it
  // and then calls the route save handler passed down from the parent
  const saveClick = () => {
    const errorMessages = validateRouteInformation(state.path, state.data);
    setErrors(errorMessages);
    if (!errorMessages) {
      const enteredResponses = Object.fromEntries(
        Object.entries(state.data)
          .filter(entry => entry[1]),
      );
      clickSaveHandler(state.path, route.path, enteredResponses);
    }
  };

  return html`
    <div class="column">
      <div class="box">
        <h2 class="title">
          ${state.path.length === 0 ? 'New Route' : html`Custom Route for <code>${state.path}</code>`}
        </h2>

        ${errors ? html`<${ErrorDisplay} errors=${errors} />` : ''}

        <label class="label">endpoint path</label>
        <div class="field has-addons">
          <div class="control">
            <a class="button is-static">
              https://${apiName}.200ok.app
            </a>
          </div>
          <div class="control is-expanded">
            <input class="input" type="text" placeholder="e.g. /logout" stateDispatch=${stateDispatch} value="${state.path}" />
          </div>
        </div>

        <hr />
        <${MethodResponse} type='GET' data=${route.data.GET} stateDispatch=${stateDispatch} validJsonDispatch=${validJsonDispatch} />
        <hr />
        <${MethodResponse} type='POST' data=${route.data.POST} stateDispatch=${stateDispatch} validJsonDispatch=${validJsonDispatch} />
        <hr /> 
        <${MethodResponse} type='PUT' data=${route.data.PUT} stateDispatch=${stateDispatch} validJsonDispatch=${validJsonDispatch} />
        <hr /> 
        <${MethodResponse} type='DELETE' data=${route.data.DELETE} stateDispatch=${stateDispatch} validJsonDispatch=${validJsonDispatch} />
        <hr />

        <div class="field is-grouped">
          <p class="control">
            <button class="button is-primary" onClick=${saveClick} disabled=${!(Object.values(validJson).every(v => v))}>
              <span class="icon is-small">
                <i class="fas fa-save"></i>
              </span>
              <span>
                Save Changes
              </span>
            </button>
          </p>
          <p class="control">
            <button class="button is-danger" onClick=${() => clickDeleteHandler(route.path)} disabled=${!route.path}>
              <span class="icon is-small">
                <i class="fas fa-ban"></i>
              </span>
              <span>
              Delete Route
              </span>
            </button>
          </p>
        </div>

      </div>
    </div>
  `;
}
