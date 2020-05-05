import {
  html, useState, useEffect, useRef,
} from '../preact-htm.js';

const stringify = str => (str ? JSON.stringify(str, null, 2) : '');
const validate = (string) => {
  try {
    JSON.parse(string);
    return true;
  } catch (_) { return false; }
};

export default function RouteDetailsResponse({
  type, path, data, stateDispatch, validJsonDispatch,
}) {
  const [response, setResponse] = useState(stringify(data));
  const [validJson, setValidJson] = useState(validate(stringify(data)));
  const [isActive, setIsActive] = useState(!!data);
  const jsonText = useRef(null);

  // useEffect needs the path to be able to update component state even when
  // the data prop is seemingly the same (undefined) after another route is
  // selected (this would otherwise lead to problems when the response is activated
  // but no response is entered, so it would stay activated after another route is selected)
  useEffect(() => {
    const stringified = stringify(data);
    setResponse(stringified);
    setIsActive(!!data);
    setValidJson(validate(stringified));
  }, [data, path]);

  // update RouteDetails JSON validity state after active state is toggled
  useEffect(() => {
    if (!isActive) {
      stateDispatch({ op: 'DISABLE_METHOD', type });
      validJsonDispatch({ type, value: true });
    }
  }, [isActive, type]);


  // update RouteDetails with new response data as well as JSON validity state after each change
  const responseEntryHandler = (e) => {
    const { value } = e.target;
    const isValid = validate(value);

    setResponse(value);
    setValidJson(isValid);
    stateDispatch({ op: 'UPDATE_METHOD', type, newData: value });
    validJsonDispatch({ type, value: isValid });
  };

  // handler to toggle isActive state and update RouteDetail with validity (false by default)
  // so that the save button gets disabled when a response type has just been activated without
  // any data entered
  const toggleActive = () => {
    setIsActive(state => !state);
    // check isActive for false since state is not yet updated at this point
    if (!isActive) {
      const isValid = jsonText.current ? validate(jsonText.current.value) : false;
      validJsonDispatch({ type, value: isValid });
    }
  };

  if (isActive) {
    return html`
    <div class="field">
      <div class="control">
        <label class="checkbox">
          <input type="checkbox" onClick=${toggleActive} checked=${isActive} /> Allow ${type} requests
        </label>
      </div>
    </div>

    <div class="field">
      <label class="label">JSON response to ${type}</label>
      <div class="control">
        <textarea class="textarea" onInput=${responseEntryHandler} ref=${jsonText} placeholder="enter JSON here" value="${response}" />
        <p>${validJson ? '' : html`<div class="notification is-warning">Please enter valid JSON.</div>`}</p>
      </div>
    </div>
  `;
  }

  return html`
  <div class="field">
    <div class="control">
      <label class="checkbox">
        <input type="checkbox" onClick=${toggleActive} checked=${isActive} /> Allow ${type} requests
      </label>
    </div>
  </div>
  `;
}
