import { html, useState, useEffect, useRef } from '../preact-htm.js';

export default function methodResponse({ type, data, updateResponse }) {
  const validateJsonString = (string) => {
    try {
      JSON.parse(string);
      return true;
    } catch (_) { return false; }
  };

  const convertInitialData = (obj) => {
    if (!obj || !obj[type]) return '';
    return JSON.stringify(obj[type], null, 2);
  };

  const [value, setValue] = useState(convertInitialData(data));
  const [validJson, setValidJson] = useState(false);
  const [isActive, setIsActive] = useState(!!data[type]);

  const prevDataRef = useRef();

  useEffect(() => {
    prevDataRef.current = data;
  });

  const prevData = prevDataRef.current;

  useEffect(() => {
    if (data === prevData);
    const newData = convertInitialData(data);
    setValue(newData);
    setIsActive(newData !== '');
    if (type === 'POST') {
      console.log('---------------');
      console.log(`New data received for ${type}`);
      console.log('New data is:');
      console.log(data);
      console.log('prevData is:');
      console.log(prevData);
    }
  }, [data]);

  useEffect(() => {
    const isValid = validateJsonString(value);
    setValidJson(isValid);
    updateResponse(type, value, isValid);
  }, [value]);

  // handler for inputs in textarea
  const handleChange = (e) => {
    const jsonText = e.target.value;
    setValue(jsonText);
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
