import Customize from './customize.js';
import ApiName from './apiNameContext.js';

import { html, render } from '../preact-htm.js';

const mountPoint = document.getElementById('customize-container');
const { apiName } = mountPoint.dataset;

render(
  html`
    <${ApiName.Provider} value=${apiName}>
      <${Customize} />
    <//}
  `, mountPoint);
