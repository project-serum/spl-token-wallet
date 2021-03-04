const request = (() => {
    let requestId = 0;

    return (method, params) => {
        const id = requestId++;
        
        return new Promise((resolve, reject) => {
            let clear;

            const timeout = setTimeout(() => {
                clear();
                reject('Sollet timed out');
            });

            const listener = (event) => {
                if (event.detail.id === id) {
                    clear();
                    resolve(event.detail.data);
                }
            };
            
            clear = () => {
                window.removeEventListener('sollet_injected_script_message', listener);
                clearTimeout(timeout);
            };

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

        connect(options = {}) {
            if (onProcess) {
                return;
            }

            onProcess = true;
            request('connect', options)
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
