import { html, useState, useEffect } from '../preact-htm.js';

export default function methodResponse({ type, data, updateResponse }) {
  const validateJsonString = (string) => {
    try {
      JSON.parse(string);
      return true;
    } catch (_) { return false; }
  };

  const convertInitialData = (obj) => {
    if (!obj) return '';
    const string = JSON.stringify(obj, null, 2);
    return validateJsonString(string) ? string : '';
  };

  const [value, setValue] = useState(convertInitialData(data));
  const [validJson, setValidJson] = useState(validateJsonString(value));
  const [isActive, setIsActive] = useState(value !== '');

  useEffect(() => {
    const newData = convertInitialData(data);
    setValue(newData);
  }, [data]);

  useEffect(() => {
    setIsActive(value !== '');
    setValidJson(validateJsonString(value));
  }, [value]);

  // handler for inputs in textarea
  const handleChange = (e) => {
    const jsonText = e.target.value;
    const isValid = validateJsonString(jsonText);
    setValue(jsonText);
    updateResponse(type, jsonText, isValid);
  };

  const toggleInput = () => {
    setIsActive(!isActive);
    setValue('{}');
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
