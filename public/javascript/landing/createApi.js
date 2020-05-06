import { html, useState, useEffect } from '../preact-htm.js';

import ErrorBox from './errorBox.js';

export default function CreateApi({ authed }) {
  const [clicked, setClicked] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(async () => {
    if (!clicked) return;
    let response;

    try {
      response = await fetch('/api/create', {
        method: 'POST',
      });
      response = await response.json();
      if (response.error) {
        setError(response.error);
        return;
      }
      setData(response);
    } catch (_) {
      setError('Something went wrong. Please try again later.');
    }
  }, [clicked]);

  const handleCreationClick = () => {
    if (authed) {
      window.location.href = '/dashboard/create';
      return;
    }
    setClicked(true);
  };

  if (data) {
    return html`
      <div class="columns">
        <div class="column has-text-centered">
          <table class="table is-hoverable is-striped">
            <tr>
              <td><strong>Your API name</strong></td><td><span class="is-family-monospace">${data.apiName}</span></td>
            </tr>
            <tr>
              <td><strong>Your API key</strong></td><td><span class="is-family-monospace">${data.apiKey}</span></td>
            </tr>
            <tr>
              <td><strong>Your API URL</strong></td><td><span class="is-family-monospace">https://${data.apiName}.200ok.app</span></td>
            </tr>
          </table>
          <p class="information">How about you try it out right now?</p>
          <div class="code-block">
            curl -d '{"name":"Testuser"}' -H "Content-Type: application/json" -X POST https://${data.apiName}.200ok.app/users<br />
            curl https://${data.apiName}.200ok.app/users
          </div>
          <p class="information">For more information about how you can use and customize your API, head to the <a href="/documentation">docs</a>.</p>
        </div>
      </div>
    `;
  }

  return html`
    <div class="columns">
      <div class="column has-text-centered">
        ${error && html`<${ErrorBox} error=${error} />`}
        <button class="button is-primary is-outlined is-large" disabled=${clicked} onClick=${handleCreationClick}>
          <span class="icon is-large">
            <i class="fas fa-file-alt"></i>
          </span>
          <span>Create your API</span>
        </button>
      </div>
    </div>
  `;
}
