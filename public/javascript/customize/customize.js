/* slint-disable */

import useFetch from './useFetch.js';
import RouteList from './routeList.js';
import RouteDetails from './routeDetails.js';

import { html } from '../preact-htm.js';

export default function Customize({ apiName }) {
  const { data, error, isLoading } = useFetch(`/api/customize/${apiName}`, 'GET');

  console.log(`data is ${data}`);
  console.log(`error is ${error}`);
  console.log(`isLoading is ${isLoading}`);

  if (isLoading) {
    return html`
      <div class="box">
        <div class="fa-3x">
          <i class="fas fa-spinner fa-pulse"></i>
        </div>
        <p>Loading custom routes ...</p>
      </div>
    `;
  }

  if (!isLoading && error) {
    return html`
      <div class="box">
        ${error}
        <a href="/dashboard">Return to dashboard</a>
      </div>
    `;
  }

  return html`
    <div class="columns">
      <${RouteList} routes=${data} />
      <${RouteDetails} />
    </div>
  `;
}
