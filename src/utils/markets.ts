import { MARKETS } from '@project-serum/serum';
import { PublicKey } from '@solana/web3.js';
import { MAINNET_URL } from './connection';

interface Markets {
  [coin: string]: {
    publicKey: PublicKey;
    name: string;
    deprecated?: boolean;
  }
}

export const serumMarkets = (() => {
  const m: Markets = {};
  MARKETS.forEach((market) => {
    const coin = market.name.split('/')[0];
    if (m[coin]) {
      // Only override a market if it's not deprecated	.
      if (!m.deprecated) {
        m[coin] = {
          publicKey: market.address,
          name: market.name.split('/').join(''),
        };
      }
    } else {
      m[coin] = {
        publicKey: market.address,
        name: market.name.split('/').join(''),
      };
    }
  });
  return m;
})();

// Create a cached API wrapper to avoid rate limits.
class PriceStore {
  public cache: {}

  constructor() {
    this.cache = {};
  }

  public getFromCache(marketName: string) {
    return this.cache[marketName]
  }

  public async getPrice(connection, marketName): Promise<number | undefined | null> {
    return new Promise((resolve, reject) => {
      if (connection._rpcEndpoint !== MAINNET_URL) {
        resolve(null);
        return;
      }
      if (this.cache[marketName] === undefined) {
        let CORS_PROXY = "https://ancient-peak-37978.herokuapp.com/"
        fetch(`${CORS_PROXY}https://serum-api.bonfida.com/orderbooks/${marketName}`).then(
          (resp) => {
            resp.json().then((resp) => {
              if (!resp || !resp.data || !resp.data.asks || !resp.data.bids) {
                resolve(null)
                return
              }

              if (resp.data.asks.length === 0 && resp.data.bids.length === 0) {
                resolve(null);
              } else if (resp.data.asks.length === 0) {
                resolve(resp.data.bids[0].price);
              } else if (resp.data.bids.length === 0) {
                resolve(resp.data.asks[0].price);
              } else {
                const mid =
                  (resp.data.asks[0].price + resp.data.bids[0].price) / 2.0;
                this.cache[marketName] = mid;
                resolve(this.cache[marketName]);
              }
            });
          },
        ).catch(e => {
          resolve(null)
        });
      } else {
        return resolve(this.cache[marketName]);
      }
    });
  }
}

export const priceStore = new PriceStore();
