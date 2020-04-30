import { html, useState, useEffect } from '../preact-htm.js';

const stringify = str => (str ? JSON.stringify(str, null, 2) : '');
const validate = (string) => {
  try {
    JSON.parse(string);
    return true;
  } catch (_) { return false; }
};

export default function methodResponse({
  type, data, stateDispatch, validJsonDispatch,
}) {
  const [response, setResponse] = useState(stringify(data));
  const [validJson, setValidJson] = useState(validate(stringify(data)));
  const [isActive, setIsActive] = useState(!!data);

  useEffect(() => {
    const stringified = stringify(data);
    setResponse(stringified);
    setIsActive(!!data);
    setValidJson(validate(stringified));
  }, [data]);

  useEffect(() => {
    if (!isActive) {
      stateDispatch({ op: 'DISABLE_METHOD', type });
      validJsonDispatch({ type, value: true });
    }
  }, [isActive, type]);


  const responseEntryHandler = (e) => {
    const { value } = e.target;
    const isValid = validate(value);

    setResponse(value);
    setValidJson(isValid);
    stateDispatch({ op: 'UPDATE_METHOD', type, newData: value });
    validJsonDispatch({ type, value: isValid });
  };

  const toggleActive = () => {
    setIsActive(state => !state);
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
        <textarea class="textarea" onInput=${responseEntryHandler} placeholder="enter JSON here" value="${response}" />
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
