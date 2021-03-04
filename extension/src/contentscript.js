const script = document.createElement('script');
script.src = chrome.runtime.getURL('script.js');
script.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(script);

window.addEventListener('sollet_contentscript_message', (event) => {
    const request = event.detail;
    handleRequest(request.data, (data) => {
        const response = {id: request.id, data};
        window.dispatchEvent(new CustomEvent('sollet_injected_script_message', { detail: response }));
    });
});

function handleRequest({ method, params }, send) {
    console.log(method, params);
    if (method === 'connect') {
        chrome.windows.create({})
        return { publicKey: 'TEST_KEY', autoApprove: true, network: 'https://solana-api.projectserum.com' };
    }

    if (method === 'disconnect') {
        chrome.windows.create({url: "index.html", type: "popup"});
        return send(true);
    }

    if (method === 'signTransaction') {
        console.log('Must sign... ' + params.transaction);
        return 'Signed tx ' + Math.random();
    }
}