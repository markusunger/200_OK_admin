const handleIndexPage = (function createIndexPageHandler() {
  return () => {
    const createApiButton = document.getElementById('create-api');
    const column = document.getElementById('info-box');

    const fetchNewApi = async () => {
      try {
        let data = await fetch('/api/', {
          method: 'POST',
          body: JSON.stringify({}),
        });
        data = await data.json();
        return data;
      } catch (error) {
        return null;
      }
    };

    createApiButton.addEventListener('click', async (e) => {
      e.preventDefault();
      e.target.classList.add('is-loading');
      const data = await fetchNewApi();
      if (!data) {
        e.target.disabled = true;
        e.target.innerHTML = 'Something went wrong :(';
        return false;
      }

      const { apiName, apiKey } = data;

      // create table with API information
      const apiInfo = document.createElement('div');
      apiInfo.classList.add('box');
      apiInfo.innerHTML = `<table class="table is-hoverable is-striped">
        <tr>
          <td><strong>Your API name</strong></td><td><span class="is-family-monospace">${apiName}</span></td>
        </tr>
        <tr>
          <td><strong>Your API key</strong></td><td><span class="is-family-monospace">${apiKey}</span></td>
        </tr>
        <tr>
          <td><strong>Your API URL</strong></td><td><span class="is-family-monospace">https://${apiName}.200ok.app</span></td>
        </tr>
      </table>
      <p class="information">How about you try it out right now?</p>
      <div class="code-block">
        curl -d '{"name":"Testuser"}' -H "Content-Type: application/json" -X POST https://${apiName}.200ok.app/users<br>
        curl https://${apiName}.200ok.app/users
      </div>
      <p class="information">For more information about how you can use and customize your API, head to the <a href="/faq">FAQ</a>.</p>
      `;

      column.innerHTML = '';
      column.appendChild(apiInfo);
      return true;
    });
  };
}());

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', handleIndexPage);
} else {
  handleIndexPage();
}
