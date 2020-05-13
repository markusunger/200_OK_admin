import { html, useState, useEffect } from '../preact-htm.js';

import ErrorBox from './errorBox.js';
import LandingInformation from './landingInformation.js';

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
      <div class="content has-text-centered">
        <table class="table is-hoverable is-striped">
          <tr>
            <td><strong>Your API name</strong></td><td><span class="is-family-monospace">${data.apiName}</span></td>
          </tr>
          <tr>
            <td><strong>Your API key</strong></td><td><span class="is-family-monospace">${data.apiKey}</span></td>
          </tr>
          <tr>
            <td><strong>Your API URL</strong></td><td><a target="_blank" href="https://${data.apiName}.200ok.app"><span class="is-family-monospace">https://${data.apiName}.200ok.app</span></a></td>
          </tr>
        </table>
        <p class="information"><strong>Note:</strong> Your API key is required to connect your API to your user account, if you ever decide to create one. Please copy and store it somewhere because it will not be possible to retrieve it later.</p>
        <p class="information">Try out your API in your command line:</p>
        <pre class="code-block">
          <code class="lang-bash">
            curl -d '{"name":"Testuser"}' -H "Content-Type: application/json" -X POST
https://${data.apiName}.200ok.app/users
&& curl https://${data.apiName}.200ok.app/users
          </code>
        </pre>
        <p class="information">For more information about how you can use and customize your API, head to the <a href="/documentation">docs</a>.</p>
      </div>
    `;
  }

  return html`
    <div class="content has-text-centered spacing-bottom">
      <h1 class="title is-4">
        A one-click, ephemeral REST API
      </h1>
      <h1 class="subtitle is-5">
        No signup or registration required.
      </h1>
      ${error && html`<${ErrorBox} error=${error} />`}
      <button class="button is-primary is-inverted is-large " disabled=${clicked} onClick=${handleCreationClick}>
        <span class="icon is-large">
          <i class="fas fa-file-alt"></i>
        </span>
        <span>Create your API</span>
      </button>
    </div>

    <${LandingInformation} />
  `;
}
