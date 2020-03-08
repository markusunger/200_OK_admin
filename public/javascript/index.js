const handleIndexPage = (function createIndexPageHandler() {
  return () => {
    const createApiButton = document.getElementById('create-api');
    const infoBox = document.getElementById('info-box');

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
      e.target.disabled = true;
      const data = await fetchNewApi();
      if (!data) return false;
      const { apiName, apiKey } = data;

      infoBox.innerHTML = `<p>Your new API is available under <strong>${apiName}</strong>.api.localhost</p>`;
      setTimeout(() => {
        e.target.disabled = false;
      }, 2000);
      return true;
    });
  };
}());

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', handleIndexPage);
} else {
  handleIndexPage();
}
