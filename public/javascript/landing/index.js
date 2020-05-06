/* eslint-disable no-eval */

import { html, render } from '../preact-htm.js';

import CreateApi from './createApi.js';
import LandingInformation from './landingInformation.js';

const mountPoint = document.getElementById('landing-page-container');
const { authed } = mountPoint.dataset;

render(
  html`
    <${CreateApi} authed=${eval(authed)} />
    <${LandingInformation} />
  `, mountPoint,
);
