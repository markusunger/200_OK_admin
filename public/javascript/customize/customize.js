/* slint-disable */

import useFetch from './useFetch.js';
import RouteList from './routeList.js';
import RouteDetails from './routeDetails.js';

import { html, useState } from '../preact-htm.js';

export default function Customize({ apiName }) {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const { data, error, isLoading } = useFetch(`/api/customize/${apiName}`, 'GET');

  // reset selected route to null if no custom routes present (e.g. by deleting the last one)
  // otherwise set to first route
  if (data && data.length === 0) {
    setSelectedRoute(null);
  }
  // if (data) setSelectedRoute(0);

  // click handler for items in routeList
  const clickHandler = (e) => {
    const routePath = e.target.getAttribute('data-route');
    let idx = data.findIndex(route => route.path === routePath);
    if (idx < 0) idx = 0;
    setSelectedRoute(idx);
  };

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
      <${RouteList} routes=${data} clickHandler=${clickHandler} selectedRoute=${selectedRoute} />
      <${RouteDetails} route=${data ? data[selectedRoute] : null} />
    </div>
  `;
}
