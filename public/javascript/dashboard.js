const handleDashboard = (function createDashboardHandler() {

  // loading information + fa spinne r
  const loadingAnimation = `
    <div class="fa-3x">
      <i class="fas fa-spinner fa-pulse"></i>
    </div>
    <p>Loading API information ...</p>
  `;

  // error message on ajax request fail
  const ajaxError = `
    <p>Something went wrong. Please try again later.</p>
  `;

  // information about API + available actions links
  const apiInfoBlock = (apiInfo) => {
    const { apiName, createdAtFormatted, expiresIn } = apiInfo;

    return `
      <h3 class="title is-5">${apiName}</h3>
      <p>Expires ${expiresIn}</p>
      <p class="is-small">(Created on ${createdAtFormatted})</p>
      <div class="information">
        <a class="button is-medium is-primary is-fullwidth" href="/debug/${apiName}">
          <span class="icon is-medium">
            <i class="fas fa-wrench"></i>
          </span>
          <span>Debug Requests/Responses</span>
        </a>
      </div>
      <div class="information">
        <a class="button is-medium is-primary is-fullwidth" href="/customize/${apiName}">
          <span class="icon is-medium">
            <i class="fas fa-pen"></i>
          </span>
          <span>Customize Endpoint Behavior</span>
        </a>
      </div>
    `;
  };

  return async () => {
    const fetchApiInfo = async (apiName) => {
      try {
        let data = await fetch(`/api/info/${apiName}`);
        data = await data.json();
        console.log(data);
        return data;
      } catch (error) {
        return null;
      }
    };

    const apiList = Array
      .from(document.querySelectorAll('a[data-name]'))
      .map(span => span.dataset.name);

    const apiSelector = document.querySelector('nav.panel');
    const apiInfoBox = document.getElementById('api-info-box');
    let isActive;

    try {
      const apiInfo = await fetchApiInfo(apiList[0]);
      if (!apiInfo) {
        apiInfoBox.innerHTML = ajaxError;
      }
      apiInfoBox.innerHTML = apiInfoBlock(apiInfo);
      [isActive] = apiList;
      document.querySelector(`[data-name="${isActive}"]`).classList.add('is-active');
    } catch (error) {
      apiInfoBox.innerHTML = ajaxError;
    }

    apiSelector.addEventListener('click', async (e) => {
      if (!e.target.dataset.name) return false;

      document.querySelector(`[data-name="${isActive}"]`).classList.remove('is-active');
      apiInfoBox.innerHTML = loadingAnimation;
      const apiName = e.target.dataset.name;
      isActive = apiName;
      document.querySelector(`[data-name="${isActive}"]`).classList.add('is-active');

      try {
        const apiInfo = await fetchApiInfo(apiName);
        if (!apiInfo) {
          apiInfoBox.innerHTML = ajaxError;
        }
        apiInfoBox.innerHTML = apiInfoBlock(apiInfo);
      } catch (error) {
        apiInfoBox.innerHTML = ajaxError;
      }
      return true;
    });
  };
}());

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', handleDashboard);
} else {
  handleDashboard();
}
