/* slint-disable */

import useFetch from './useFetch.js';
import RouteList from './routeList.js';
import RouteDetails from './routeDetails.js';

import { html, useState } from '../preact-htm.js';

export default function Customize({ apiName }) {
  const [selectedRoute, setSelectedRoute] = useState(0);
  const [isNewRoute, setIsNewRoute] = useState(false);

  // custom fetch hook to get all previously defined routes on component mount
  const {
    data,
    error,
    isLoading,
    refetch,
  } = useFetch(`/api/customize/${apiName}`, 'GET');

  // reset selected route to null if no custom routes present (e.g. by deleting the last one)
  // otherwise set to first route
  if (data && data.length === 0) {
    setSelectedRoute(null);
  }

  // set route to be passed to routeDetails component
  let route;
  if (isNewRoute) {
    route = {
      path: '',
      data: {
        GET: {},
      },
    };
  } else if (data) {
    route = data[selectedRoute];
  } else {
    route = null;
  }

  // click handler for items in routeList
  const clickItemHandler = (e) => {
    setIsNewRoute(false);
    const routePath = e.target.getAttribute('data-route');
    let idx = data.findIndex(r => r.path === routePath);
    if (idx < 0) idx = 0;
    setSelectedRoute(idx);
  };

  // click handler for new route button in routeList
  const clickNewHandler = () => {
    setIsNewRoute(true);
    setSelectedRoute(null);
  };

  // click handler for save button in routeDetails
  const clickSaveHandler = async () => {

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
        <p>${error}</p>
        <a href="/dashboard">Return to dashboard</a>
      </div>
    `;
  }


  return html`
    <div class="columns">
      <${RouteList} routes=${data} clickItemHandler=${clickItemHandler} clickNewHandler=${clickNewHandler} selectedRoute=${selectedRoute} />
      <${RouteDetails} route=${route} apiName=${apiName} />
    </div>
  `;
}
