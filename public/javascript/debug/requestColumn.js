import { html, useEffect, useRef } from '../preact-htm.js';
import styleJSON from './styleJSON.js';

export default function RequestColumn({ request }) {
  const headerBlock = useRef(null);
  const bodyBlock = useRef(null);

  const prettyHeaders = styleJSON(JSON.stringify(request.headers, null, 2));
  const prettyBody = styleJSON(JSON.stringify(request.body, null, 2));

  useEffect(() => {
    headerBlock.current.innerHTML = prettyHeaders;
    bodyBlock.current.innerHTML = prettyBody;
  }, [request]);


  return html`
    <div>
      <h2 class="title is-5">Request</h2>
      <div class="is-clearfix">
        <table class="table is-hoverable is-striped is-narrow is-pulled-left">
          <tr>
            <td><strong>method</strong></td>
            <td><code>${request.method}</td></td>
          </tr>
          <tr>
            <td><strong>path</strong></td>
            <td><code>${request.target}</code></td>
          </tr>
        </table>
      </div>
      <h3 class="title is-6 spacing-top">Headers</h3>
      <pre class="code-block" ref=${headerBlock}></pre>
      <h3 class="title is-6 spacing-top">Body</h3>
      <pre class="code-block" ref=${bodyBlock}></div>
    </div>
  `;
}
