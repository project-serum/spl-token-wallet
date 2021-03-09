const responseHandlers = new Map();

function launchPopup(message, sender, sendResponse) {
  const searchParams = new URLSearchParams();
  searchParams.set('origin', sender.origin);
  searchParams.set('network', message.data.params.network);
  searchParams.set('request', JSON.stringify(message.data));

  // TODO consolidate popup dimensions
  chrome.windows.create({
    url: 'index.html/#' + searchParams.toString(),
    type: 'popup',
    width: 375,
    height: 600,
    setSelfAsOpener: true,
    focused: true,
  });

  responseHandlers.set(message.data.id, sendResponse);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.channel === 'sollet_contentscript_background_channel') {
    if (
      message.data.method === 'connect' ||
      message.data.method === 'disconnect'
    ) {
      chrome.storage.local.get('connectedWallets', (result) => {
        const connectedWallet = (result.connectedWallets || {})[sender.origin];
        if (!connectedWallet) {
          launchPopup(message, sender, sendResponse);
          return;
        }
        if (message.data.method === 'connect') {
          sendResponse({
            method: 'connected',
            params: {
              publicKey: connectedWallet.publicKey,
              autoApprove: connectedWallet.autoApprove,
            },
            id: message.data.id,
          });
        } else if (message.data.method === 'disconnect') {
          delete result.connectedWallets[sender.origin];
          chrome.storage.local.set(
            { connectedWallets: result.connectedWallets },
            () => sendResponse({ method: 'disconnected', id: message.data.id }),
          );
        }
      });
    } else {
      launchPopup(message, sender, sendResponse);
    }
    // keeps response channel open
    return true;
  } else if (message.channel === 'sollet_extension_background_channel') {
    const responseHandler = responseHandlers.get(message.data.id);
    responseHandlers.delete(message.data.id);
    responseHandler(message.data);
  }
});
