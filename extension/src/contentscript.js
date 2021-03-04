const script = document.createElement('script');
script.src = chrome.runtime.getURL('script.js');
script.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(script);

window.addEventListener('sollet_contentscript_message', (event) => {
    const request = event.detail;

    chrome.runtime.sendMessage({
        channel: 'sollet_background_message',
        method: request.data.method,
        params: request.data.params,
    }, (data) => {
        const response = {id: request.id, data};
        window.dispatchEvent(new CustomEvent('sollet_injected_script_message', { detail: response }));
    });
});