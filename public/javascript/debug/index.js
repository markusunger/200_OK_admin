/* eslint-disable */

import Debug from './debug.js';

import {
  html,
  render,
} from '../preact-htm.js';

const mountPoint = document.getElementById('debug-container');
const { apiName } = mountPoint.dataset;

render(html`<${Debug} apiName=${apiName} />`, mountPoint);
