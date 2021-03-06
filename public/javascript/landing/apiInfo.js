import { html } from '../preact-htm.js';

export default function ApiInfo({ data }) {
  return html`
    <div class="content has-text-centered">
      <table class="table is-hoverable is-striped">
        <tr>
          <td><strong>Your API name</strong></td><td><span class="is-family-monospace">${data.apiName}</span></td>
        </tr>
        <tr>
          <td><strong>Your API key</strong></td><td><span class="is-family-monospace">${data.apiKey}</span></td>
        </tr>
        <tr>
          <td><strong>Your API URL</strong></td><td><a target="_blank" href="https://${data.apiName}.200ok.app"><span class="is-family-monospace">https://${data.apiName}.200ok.app</span></a></td>
        </tr>
      </table>
      <p class="information"><strong>Note:</strong> Your API key is required to connect your API to your user account, if you ever decide to create one. Please copy and store it somewhere because it will not be possible to retrieve it later.</p>
      <p class="information">Try out your API in your command line:</p>
      <pre class="code-block has-text-left">
        <code class="lang-bash">
${`curl \\
  -d '{"name":"Testuser"}' \\
  -H "Content-Type: application/json" \\
  -X POST \\
  https://${data.apiName}.200ok.app/users &&
curl https://${data.apiName}.200ok.app/users`}
        </code>
      </pre>
      <p class="information">For more information about how you can use and customize your API, head to the <a href="/documentation">docs</a>.</p>
    </div>
  `;
}
