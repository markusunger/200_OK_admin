function handleDebug() {
  // eslint-disable-next-line no-undef
  const sse = new EventSource(`/api/debug-stream/${apiName}`);
  const debugBox = document.getElementById('debug-box');

  sse.addEventListener('message', (e) => {
    console.log(e);
    debugBox.innerHTML = `<p>${e.data}</p>`;
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', handleDebug);
} else {
  handleDebug();
}
