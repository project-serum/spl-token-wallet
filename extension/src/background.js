chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
    handleRequest(data, sender).then(sendResponse);
});

async function handleRequest(data, sender) {
    console.log("BACKGROUND:");
    console.log(data, sender);
    const { channel, method, params } = data;
    if (channel !== 'sollet_background_message') {
        return;
    }

    if (method === 'connect') {
        // TODO CHECK IF ALREADY CONNECTED AND IMMEDIATELY RETURN
        const searchParams = new URLSearchParams();
        if (params.askForNetwork) {
            searchParams.set('askForNetwork', 'true');
            if (params.suggestedNetwork) {
                searchParams.set('suggestedNetwork', params.suggestedNetwork);
            }
        }
        searchParams.set('origin', sender.origin);

        // TODO consolidate popup dimensions
        chrome.windows.create({
            url: 'index.html/#' + searchParams.toString(),
            type: 'popup',
            width: 450,
            height: 600,
            setSelfAsOpener: true,
            focused: true,
        });
    } else if (method === 'disconnect') {
        // just do things with chrome storage
    } else if (method === 'signTransaction') {
        // TODO ASSERT ALREADY CONNECTED
        // TODO IF AUTO APPROVE, APPROVE
        // TOOD IF NOT AUTO APPROVE, ASK
    }


}