import { html, useEffect, useRef } from '../preact-htm.js';
import styleJSON from './styleJSON.js';
import StatusCode from './statusCode.js';

export default function ResponseColumn({ response }) {
  const headerBlock = useRef(null);
  const bodyBlock = useRef(null);

  const prettyHeaders = styleJSON(JSON.stringify(response.headers, null, 2));
  const prettyBody = styleJSON(JSON.stringify(response.body, null, 2));

  useEffect(() => {
    headerBlock.current.innerHTML = prettyHeaders;
    bodyBlock.current.innerHTML = prettyBody;
  }, [response]);

  return html`
    <div>
      <div class="is-clearfix">
        <h2 class="title is-5 is-pulled-left">Response</h2>
        <${StatusCode} class="is-pulled-right" status=${response.status} />
      </div>
      <h3 class="title is-6 spacing-top">Headers</h3>
      <pre ref=${headerBlock}></pre>
      <h3 class="title is-6 spacing-top">Body</h3>
      <pre ref=${bodyBlock}></pre>
    </div>
  `;
}
