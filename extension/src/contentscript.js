const script = document.createElement('script');
script.src = chrome.runtime.getURL('script.js');
script.onload = function () {
  this.remove();
};
(document.head || document.documentElement).appendChild(script);

window.addEventListener('sollet_injected_script_message', (event) => {
  chrome.runtime.sendMessage(
    {
      channel: 'sollet_contentscript_background_channel',
      data: event.detail,
    },
    (response) => {
      window.dispatchEvent(
        new CustomEvent('sollet_contentscript_message', { detail: response }),
      );
    },
  );
});
