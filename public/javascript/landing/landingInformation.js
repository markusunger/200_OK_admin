import { html } from '../preact-htm.js';

export default function LandingInformation() {
  return html`
    <div class="container">
      <div class="columns spacing-top-2x spacing-bottom outer-padding">
        <div class="column is-one-third">
          <div class="content has-text-centered">
            <span class="icon is-large has-text-primary">
              <i class="fas fa-laptop-code fa-2x logo-shadow"></i>
            </span>
            <h1 class="title is-5 lp-header">No configuration</h1>
            <h2 class="lp-subtitle">Use RESTful request methods and the API will work without any further need for setup or configuration.</h2>
          </div>
        </div>

        <div class="column is-one-third">
          <div class="content has-text-centered">
            <span class="icon is-large has-text-primary">
              <i class="fas fa-pencil-ruler fa-2x logo-shadow"></i>
            </span>
            <h1 class="title is-5 lp-header">Use from anywhere</h1>
            <h2 class="lp-subtitle">Your API is CORS-enabled, so it can be used from within the browser, any code sandbox tool or the command line.</h2>
          </div>
        </div>

        <div class="column is-one-third">
        <div class="content has-text-centered">
          <span class="icon is-large has-text-primary">
            <i class="fas fa-exclamation-triangle fa-2x logo-shadow"></i>
          </span>
          <h1 class="title is-5 lp-header">User-friendly errors</h1>
          <h2 class="lp-subtitle">Helpful error messages will make it easy to see at a glance why a request might not be successful.</h2>
        </div>
      </div>
    </div>
  </div>

  <section class="hero is-primary spacing-top-2x">
    <div class="hero-body has-text-centered">
      <h1 class="title is-4">Supercharge your experience with optional tooling</h1>
      <h1 class="subtitle is-6"><a href="/login">Login via GitHub</a> and connect your API to benefit from helpful tools that enhance your experience</h1>
    </div>
    
    
    <div class="container information">
      <div class="columns spacing-bottom outer-padding">
        <div class="column is-one-third">
          <div class="content has-text-centered">
            <span class="icon is-large has-text-light">
              <i class="fas fa-search fa-2x logo-shadow"></i>
            </span>
            <h1 class="title is-5 lp-header">Inspect your requests</h1>
            <h2 class="lp-subtitle has-text-light">Live-inspect your requests and the accompanying responses. See details about the headers and bodies.</h2>
          </div>
        </div>
        
        <div class="column is-one-third">
          <div class="content has-text-centered">
            <span class="icon is-large has-text-light">
              <i class="fas fa-edit fa-2x logo-shadow"></i>
            </span>
            <h1 class="title is-5 lp-header">Customize endpoints</h1>
            <h2 class="lp-subtitle has-text-light">Define custom JSON responses for endpoints that need it and enable or disable certain request methods.</h2>
          </div>
        </div>
        
        <div class="column is-one-third">
          <div class="content has-text-centered">
            <span class="icon is-large has-text-light">
              <i class="fas fa-tasks fa-2x logo-shadow"></i>
            </span>
            <h1 class="title is-5 lp-header">Manage and secure your APIs</h1>
            <h2 class="lp-subtitle has-text-light">Create and manage up to seven different APIs. Enable private mode to restrict access and require API authorization.</h2>
          </div>
        </div>
      </div>
    </div>
  </section>
  `;
}
