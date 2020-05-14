/* eslint-disable */

import { html, useState, useEffect } from '../preact-htm.js';

export default function ApiInfo({ selectedApi }) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(async () => {
    setIsLoading(true);
    try {
      let data = await fetch(`/api/info/${selectedApi}`, {
        credentials: 'include',
      });
      data = await data.json();
      setData(data);
      setIsLoading(false);
    } catch (error) {
      setData(null);
      setIsLoading(false);
    }
  }, [selectedApi]);

  if (isLoading) {
    return html`
      <div class="box has-text-centered">
        <div class="fa-3x">
          <i class="fas fa-spinner fa-pulse"></i>
        </div>
        <p>Loading API information ...</p>
      </div>
    `;
  } else {
    if (data) {
      const { apiName, expiresIn, createdAtFormatted } = data;

      return html`
        <div class="box has-text-centered">
          <h3 class="title is-5">${apiName}</h3>
          <p>Aavailable under <a href="https://${apiName}.200ok.app">${apiName}.200ok.app</a></p>
          <p>Expires ${expiresIn}</p>
          <p class="is-small">(Created on ${createdAtFormatted})</p>
          <div class="information">
            <a class="button is-medium is-primary is-fullwidth" href="/debug/${apiName}">
              <span class="icon is-medium">
                <i class="fas fa-wrench"></i>
              </span>
              <span>Inspect Requests/Responses</span>
            </a>
          </div>
          <div class="information">
            <a class="button is-medium is-primary is-fullwidth" href="/customize/${apiName}">
              <span class="icon is-medium">
                <i class="fas fa-pen"></i>
              </span>
              <span>Customize Endpoint Behavior</span>
            </a>
          </div>
        </div>
      `;
    } else {
      return html`
        <div>Error retrieving API information. Please try again later.</div>
      `;
    }
  }
}
