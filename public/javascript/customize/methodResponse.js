import { html, useState, useEffect } from '../preact-htm.js';

export default function methodResponse({ type, data, updateResponse }) {
  const [isActive, setIsActive] = useState(!!data);
  const [value, setValue] = useState(data);
  const [validJson, setValidJson] = useState(true);

  const outputJson = (obj = {}, pp = false) => {
    if (pp) return JSON.stringify(obj, null, 2);
    return JSON.stringify(obj);
  };

  // automatically update value state when new props arrive
  useEffect(() => {
    setIsActive(!!data);
    setValue(data);
    setValidJson(true);
  }, [data]);

  useEffect(() => {
    if (!isActive) setValue({});
  }, [isActive]);

  // handler for inputs in textarea
  const handleChange = (e) => {
    try {
      const input = JSON.parse(e.target.value);
      setValidJson(true);
      updateResponse(type, input, true);
    } catch (err) {
      updateResponse(type, '{}', false);
      setValidJson(false);
    }
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
        <textarea class="textarea" onInput=${handleChange} placeholder="enter JSON here" value="${validJson ? outputJson(value, true) : outputJson(value)}" />
        <p>${validJson ? '' : 'Please enter valid JSON.'}</p>
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
