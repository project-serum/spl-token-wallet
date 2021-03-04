const request = (() => {
    let requestId = 0;

    return (method, params) => {
        const id = requestId++;
        
        return new Promise((resolve) => {
            const listener = (event) => {
                if (event.detail.id === id) {
                    window.removeEventListener('sollet_injected_script_message', listener);
                    resolve(event.detail.data);
                }
            }

            window.addEventListener('sollet_injected_script_message', listener);

            window.dispatchEvent(new CustomEvent('sollet_contentscript_message', {
                detail: {data: { method, params }, id},
            }));
        });
    };
})();

window.sollet = (() => {
    let onProcess = false;

    const sollet = {
        publicKey: undefined,
        autoApprove: false,
        network: undefined,

        get connected() {
            return !!this.publicKey;
        },

        connect(suggestedNetwork) {
            if (onProcess) {
                return;
            }

            onProcess = true;
            request('connect', { suggestedNetwork })
                .then(({ publicKey, autoApprove, network }) => {
                    this.publicKey = publicKey;
                    this.autoApprove = autoApprove;
                    this.network = network;
                })
                .catch(() => {
                    this.disconnect();
                })
                .finally(() => {
                    onProcess = false;
                });
        },

        disconnect() {
            if (this.connected) {
                this.publicKey = undefined;
                this.autoApprove = false;
                this.network = undefined;
                request('disconnect');
            }
        },

        async signTransaction(transaction) {
            return request('signTransaction', { transaction });
        },

        async signAllTransactions(transactions) {
            const result = [];
            for (const transaction of transactions) {
                result.push(await this.signTransaction(transaction));
            }
            return result;
        },
    };

    sollet.connect = sollet.connect.bind(sollet);
    sollet.disconnect = sollet.disconnect.bind(sollet);
    sollet.signTransaction = sollet.signTransaction.bind(sollet);
    sollet.signAllTransactions = sollet.signAllTransactions.bind(sollet);

    return sollet;
})();
