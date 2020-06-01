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
      const { apiName, expiresIn, createdAtFormatted, isPrivate } = data;

      return html`
        <div class="box has-text-centered">
          <h3 class="title is-5">${apiName}</h3>
          <p class="information">Available under <a href="https://${apiName}.200ok.app">${apiName}.200ok.app</a><br />
          Expires ${expiresIn}<br />
          (Created on ${createdAtFormatted})</p>
          <p>This API is currently <strong>${isPrivate ? 'private' : 'public'}.</strong></p>

          <div class="information">
          <a class="button is-primary is-fullwidth" href="/authorization/${apiName}">
            <span class="icon is-medium">
              <i class="${isPrivate ? 'fas fa-lock-open' : 'fas fa-lock'}"></i>
            </span>
            <span>${isPrivate ? 'Disable' : 'Enable'} API Authorization</span>
          </a>
        </div>

          <div class="information">
            <a class="button is-primary is-fullwidth" href="/debug/${apiName}">
              <span class="icon is-medium">
                <i class="fas fa-wrench"></i>
              </span>
              <span>Inspect Requests/Responses</span>
            </a>
          </div>

          <div class="information">
            <a class="button is-primary is-fullwidth" href="/customize/${apiName}">
              <span class="icon is-medium">
                <i class="fas fa-tasks"></i>
              </span>
              <span>Customize Endpoint Behavior</span>
            </a>
          </div>

          <div class="warning">
            <a class="button is-danger is-fullwidth" href="/delete/${apiName}">
              <span class="icon is-medium">
                <i class="fas fa-trash-alt"></i>
              </span>
              <span>Delete this API</span>
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
