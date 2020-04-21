/* slint-disable */

import useFetch from './useFetch.js';
import RouteList from './routeList.js';
import RouteDetails from './routeDetails.js';

import { html, useState } from '../preact-htm.js';

export default function Customize({ apiName }) {
  const [selectedRoute, setSelectedRoute] = useState(0);

  // custom fetch hook to get all previously defined routes on component mount
  const {
    data,
    error,
    isLoading,
    refetch,
  } = useFetch(`/api/customize/${apiName}`, 'GET');

  // reset selected route to null if no custom routes present (e.g. by deleting the last one)
  // otherwise set to first route
  if (data && data.length === 0) setSelectedRoute(null);

  // click handler for items in routeList
  const clickItemHandler = (e) => {
    const routePath = e.target.getAttribute('data-route');
    let idx = data.findIndex(r => r.path === routePath);
    if (idx < 0) idx = 0;
    setSelectedRoute(idx);
  };

  // click handler for new route button in RouteList
  const clickNewHandler = () => {
    setSelectedRoute(null);
  };

  // click handler for delete button in RouteDetails
  const clickDeleteHandler = async (path) => {
    try {
      const result = await fetch(
        `/api/customize/${apiName}/${encodeURIComponent(path)}`,
        {
          method: 'DELETE',
          credentials: 'include',
        },
      );
      if (result.ok) {
        refetch();
        setSelectedRoute(0);
      } else {
        console.log('Something is borked.');
      }
    } catch (_) {
      // TODO: whatever
    }
  };

  // click handler for save button in RouteDetails
  const clickSaveHandler = async (path, originalPath, responses) => {
    try {
      const result = await fetch(
        `/api/customize/${apiName}/save`,
        {
          method: 'POST',
          body: JSON.stringify({ path, originalPath, responses }),
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
        },
      );
      if (result.ok) {
        refetch();
      } else {
        console.log('Something was borked!');
      }
    } catch (_) {
      // TODO: whatever
    }
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
      <${RouteDetails} route=${Number.isNaN(selectedRoute) ? null : data[selectedRoute]} apiName=${apiName} clickSaveHandler=${clickSaveHandler} clickDeleteHandler=${clickDeleteHandler} />
    </div>
  `;
}
