import { html, useState, useEffect } from '../preact-htm.js';

export default function methodResponse({ type, data, updateResponse }) {
  const prettyJson = obj => JSON.stringify(obj, null, 2);

  const [isActive, setIsActive] = useState(!!data);
  const [value, setValue] = useState(data ? prettyJson(data) : data);
  const [validJson, setValidJson] = useState(true);

  // automatically update value state when new props arrive
  useEffect(() => {
    setIsActive(!!data);
    setValue(data);
    try {
      JSON.parse(data);
      setValidJson(true);
    } catch (_) {
      setValidJson(false);
    }
  }, [data]);

  // handler for inputs in textarea
  const handleChange = (e) => {
    let jsonText;
    try {
      jsonText = e.target.value;
      JSON.parse(jsonText);
      setValidJson(true);
    } catch (_) {
      setValidJson(false);
    }
    updateResponse(type, jsonText, validJson);
  };

  const toggleInput = () => {
    setIsActive(!isActive);
  };

  if (isActive) {
    return html`
    <div class="field">
      <div class="control">
        <label class="checkbox">
          <input type="checkbox" onClick=${toggleInput} checked=${isActive} /> Allow ${type} requests
        </label>
      </div>
    </div>

    <div class="field">
      <label class="label">JSON response to ${type}</label>
      <div class="control">
        <textarea class="textarea" onInput=${handleChange} placeholder="enter JSON here" value="${value}" />
        <p>${validJson ? '' : html`<div class="notification is-warning">Please enter valid JSON.</div>`}</p>
      </div>
    </div>
  `;
  }

  return html`
  <div class="field">
    <div class="control">
      <label class="checkbox">
        <input type="checkbox" onClick=${toggleInput} checked=${isActive} /> Allow ${type} requests
      </label>
    </div>
  </div>
  `;
}
