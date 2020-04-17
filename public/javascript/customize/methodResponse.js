import { html, useState } from '../preact-htm.js';

export default function methodResponse({ type, data }) {
  const [isActive, setIsActive] = useState(!!data);

  const toggleInput = (e) => {
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
        <textarea class="textarea" placeholder="enter JSON here">${JSON.stringify(data, null, 2)}</textarea>
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
