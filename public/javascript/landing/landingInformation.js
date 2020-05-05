import { html } from '../preact-htm.js';

export default function LandingInformation() {
  return html`
    <section class="section spacing-top">
      <div class="columns spacing-top outer-padding">
        <div class="column">
          <h2 class="title">A RESTful API. No registration required.</h2>
          <h3 class="subtitle">Your API ist just one click away and you don't even have to give up any personal information. Create your personal RESTful API and you're ready to drop it into any project or tool. Or just play around with on the command line.</h3>
        </div>
        <div class="column">
          <p>Some fancy image here ...</p>
        </div>
      </div>
    </section>

    <section class="section spacing-top">
      <div class="columns spacing-top outer-padding">
        <div class="column">
          <p>Some fancy image here ...</p>
        </div>
        <div class="column">
          <h2 class="title">Customization is just a login away.</h2>
          <h3 class="subtitle"><em>200 OK</em> provides a resource-based endpoint approach. If you need more flexibility, you can create your own custom endpoints. Define responses for each request method (GET, POST, PUT or DELETE) and let your API send the JSON payload you want.</h3>
        </div>
      </div>
    </section>

    <section class="section spacing-top">
      <div class="columns spacing-top outer-padding">
        <div class="column">
          <h2 class="title">Supercharge your debugging.</h2>
          <h3 class="subtitle">Your application is yielding unexpected results and you are not sure if the API requests are correct? Use <em>200 OK</em>'s debugging tool and inspect your requests and the resulting responses in real-time.</h3>
        </div>
        <div class="column">
          <p>Some fancy image here ...</p>
        </div>
      </div>
    </section>
  `;
}
