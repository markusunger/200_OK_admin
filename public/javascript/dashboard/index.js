import Dashboard from './dashboard.js';

import { html, render } from '../preact-htm.js';

const mountPoint = document.getElementById('dashboard-container');
let { apis } = mountPoint.dataset;
apis = apis.length > 0 ? apis.split(',') : [];

render(html`<${Dashboard} apiList=${apis} />`, mountPoint);
