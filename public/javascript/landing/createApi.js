import { html, useState, useEffect } from '../preact-htm.js';

export default function CreateApi({ authed }) {
  return html`
    <div class="columns">
      <div class="column has-text-centered">
        <p class="information">
          A one-click ephemeral REST API. No signup required.
        </p>
        <button class="button is-primary is-outlined is-large" onClick=${}>
          <span class="icon is-large">
            <i class="fas fa-file-alt"></i>
          </span>
          <span>Create your API</span>
        </button>
      </div>
    </div>
  `;
}
