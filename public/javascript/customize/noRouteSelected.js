import { html } from '../preact-htm.js';

export default function noRouteSelected() {
  return html`
  <div class="column">
  <div class="box">
    <h2 class="title">No Route Selected</h2>
    <p>Pick a custom route from the list on the left or create a new one by 
    clicking the &quot;New Custom Route&quot; button there.</p>
  </div>
</div>
  `;
}
