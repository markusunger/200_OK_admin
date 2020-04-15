/* eslint-disable */

import Customize from './customize.js';

import { html, render } from '../preact-htm.js';

const mountPoint = document.getElementById('customize-container');

render(html`<${Customize} apiName=${apiName} />`, mountPoint);
