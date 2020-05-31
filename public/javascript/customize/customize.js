import useFetch from './useFetch.js';
import RouteList from './routeList.js';
import NoRoutes from './noRoutes.js';
import RouteDetails from './routeDetails.js';
import ApiName from './apiNameContext.js';

import {
  html, useState, useEffect, useContext,
} from '../preact-htm.js';

const routeTemplate = {
  path: '/',
  data: {
    GET: {
      'your-key': 'your-value',
    },
  },
};

export default function Customize() {
  const [selectedRoute, setSelectedRoute] = useState(0);
  const apiName = useContext(ApiName);

  // use custom fetch hook to get all previously defined routes on component mount
  const {
    routes, error, isLoading, refetch,
  } = useFetch(`/api/customize/${apiName}`, 'GET');

  useEffect(() => {
    if (!routes) return;
    if (routes.length > 0) setSelectedRoute(routes.length - 1);
  }, [setSelectedRoute, routes]);

  // click handler for items in RouteList
  const clickRouteHandler = (e) => {
    const { path } = e.target.dataset;
    let idx = routes.findIndex(r => r.path === path);
    if (idx < 0) idx = 0;
    setSelectedRoute(idx);
  };

  // click handler for new route button in RouteList
  const clickNewHandler = () => {
    setSelectedRoute(-1);
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
        return true;
      }
      return false;
    } catch (_) {
      return false;
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
        return true;
      }
      return false;
    } catch (_) {
      return false;
    }
  };

  if (!isLoading && error) {
    return html`
      <div class="box">
        <p>${error}</p>
        <a href="/dashboard">Return to dashboard</a>
      </div>
    `;
  }

  if (isLoading) {
    return html`
      <div class="columns">
        <${RouteList} routes=${routes} isLoading=${isLoading} selectedRoute=${selectedRoute} clickRouteHandler=${clickRouteHandler} clickNewHandler=${clickNewHandler} />
        <div class="column">
          <div class="box">
            <div>Loading custom route list ...</div>
          </div>
        </div>
      </div>
    `;
  }

  return html`
    <div class="columns">
      <${RouteList} routes=${routes} isLoading=${isLoading} selectedRoute=${selectedRoute} clickRouteHandler=${clickRouteHandler} clickNewHandler=${clickNewHandler} />
      ${selectedRoute === 0 && routes.length === 0
        ? html`<${NoRoutes} />`
        : html`<${RouteDetails} route=${selectedRoute >= 0 ? routes[selectedRoute] : routeTemplate} clickSaveHandler=${clickSaveHandler} clickDeleteHandler=${clickDeleteHandler} />`
      }
    </div>
  `;
}
