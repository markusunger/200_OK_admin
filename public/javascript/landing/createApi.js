import { html, useState, useEffect } from '../preact-htm.js';

import ErrorBox from './errorBox.js';
import ApiInfo from './apiInfo.js';
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
      <div class="container">
        <${ApiInfo} data=${data} />
      </div>
    `;
  }

  return html`
    <div class="container spacing-bottom">
      <div class="columns outer-padding">
        <div class="column has-text-right-desktop has-text-centered-mobile landing-title-spacing">
          <h1 class="title is-2">
            A one-click, <br />ephemeral REST API
          </h1>
          <h1 class="subtitle is-5">
            Valid for 7 days. No signup required.
          </h1>
          ${error && html`<${ErrorBox} error=${error} />`}
          <button class="button is-primary is-inverted is-large " disabled=${clicked} onClick=${handleCreationClick}>
            <span class="icon is-large">
              <i class="fas fa-file-alt"></i>
            </span>
            <span>Create your API</span>
          </button>
        </div>

        <div class="column has-text-left-dekstop has-text-centered-mobile">
          <img class="shadow" src="/images/200ok_key_graphic.png" alt="Illustrative graphic" />
        </div>
      </div>
    </div>
      
    <${LandingInformation} />
  `;
}
