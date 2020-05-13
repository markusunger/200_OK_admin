/* eslint-disable no-eval */

import { html, render } from '../preact-htm.js';

import CreateApi from './createApi.js';

const mountPoint = document.getElementById('landing-page-container');
let { authed } = mountPoint.dataset;
authed = authed === 'true';

render(
  html`
    <${CreateApi} authed=${authed} />
  `, mountPoint,
);
