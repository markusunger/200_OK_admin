import { html } from '../preact-htm.js';

export default function routeDetails({ route }) {
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
        <h2 class="title"><code>${route.path}</code></h2>
      </div>
    </div>
  `;
}
