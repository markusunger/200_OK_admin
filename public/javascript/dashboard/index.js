import Dashboard from './dashboard.js';

import { html, render } from '../preact-htm.js';

const mountPoint = document.getElementById('dashboard-container');
const apis = mountPoint.dataset.apis.split(',');

render(html`<${Dashboard} apiList=${apis} />`, mountPoint);
