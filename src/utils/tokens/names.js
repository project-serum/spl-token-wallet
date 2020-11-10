import EventEmitter from 'events';
import { useConnectionConfig, MAINNET_URL } from '../connection';
import { useListener } from '../utils';
import { useCallback } from 'react';

export const TOKENS = {
  [MAINNET_URL]: [
    {
      mintAddress: 'SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt',
      tokenName: 'Serum',
      tokenSymbol: 'SRM',
      icon:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x476c5E26a75bd202a9683ffD34359C0CC15be0fF/logo.png',
    },
    {
      mintAddress: 'MSRMcoVyrFxnSgo5uXwone5SKcGhT1KEJMFEkMEWf9L',
      tokenName: 'MegaSerum',
      tokenSymbol: 'MSRM',
      icon:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x476c5E26a75bd202a9683ffD34359C0CC15be0fF/logo.png',
    },
    {
      tokenSymbol: 'BTC',
      mintAddress: '9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E',
      tokenName: 'Wrapped Bitcoin',
      icon:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png',
    },
    {
      tokenSymbol: 'ETH',
      mintAddress: '2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk',
      tokenName: 'Wrapped Ethereum',
      icon:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
    },
    {
      tokenSymbol: 'FTT',
      mintAddress: 'AGFEad2et2ZJif9jaGpdMixQqvW5i81aBdvKe7PHNfz3',
      tokenName: 'Wrapped FTT',
      icon:
        'https://raw.githubusercontent.com/trustwallet/assets/f3ffd0b9ae2165336279ce2f8db1981a55ce30f8/blockchains/ethereum/assets/0x50D1c9771902476076eCFc8B2A83Ad6b9355a4c9/logo.png',
    },
    {
      tokenSymbol: 'YFI',
      mintAddress: '3JSf5tPeuscJGtaCp5giEiDhv51gQ4v3zWg8DGgyLfAB',
      tokenName: 'Wrapped YFI',
      icon:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e/logo.png',
    },
    {
      tokenSymbol: 'LINK',
      mintAddress: 'CWE8jPTUYhdCTZYWPTe1o5DFqfdjzWKc9WKz6rSjQUdG',
      tokenName: 'Wrapped Chainlink',
      icon:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png',
    },
    {
      tokenSymbol: 'XRP',
      mintAddress: 'Ga2AXHpfAF6mv2ekZwcsJFqu7wB4NV331qNH7fW9Nst8',
      tokenName: 'Wrapped XRP',
      icon:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ripple/info/logo.png',
    },
    {
      tokenSymbol: 'USDT',
      mintAddress: 'BQcdHdAQW1hczDbBi9hiegXAR7A98Q9jx3X3iBBBDiq4',
      tokenName: 'Wrapped USDT',
      icon:
        'https://raw.githubusercontent.com/trustwallet/assets/f3ffd0b9ae2165336279ce2f8db1981a55ce30f8/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
    },
    {
      tokenSymbol: 'USDC',
      mintAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      tokenName: 'USD Coin',
      icon:
        'https://raw.githubusercontent.com/trustwallet/assets/f3ffd0b9ae2165336279ce2f8db1981a55ce30f8/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
    },
    {
      tokenSymbol: 'WUSDC',
      mintAddress: 'BXXkv6z8ykpG1yuvUDPgh732wzVHB69RnB9YgSYh3itW',
      tokenName: 'Wrapped USDC',
      icon:
        'https://raw.githubusercontent.com/trustwallet/assets/f3ffd0b9ae2165336279ce2f8db1981a55ce30f8/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
      deprecated: true,
    },
    {
      tokenSymbol: 'SUSHI',
      mintAddress: 'AR1Mtgh7zAtxuxGd2XPovXPVjcSdY3i4rQYisNadjfKy',
      tokenName: 'Wrapped SUSHI',
      icon:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B3595068778DD592e39A122f4f5a5cF09C90fE2/logo.png',
    },
    {
      tokenSymbol: 'ALEPH',
      mintAddress: 'CsZ5LZkDS7h9TDKjrbL7VAwQZ9nsRu8vJLhRYfmGaN8K',
      tokenName: 'Wrapped ALEPH',
      icon:
        'https://raw.githubusercontent.com/trustwallet/assets/6996a371cd02f516506a8f092eeb29888501447c/blockchains/nuls/assets/NULSd6HgyZkiqLnBzTaeSQfx1TNg2cqbzq51h/logo.png',
    },
    {
      tokenSymbol: 'SXP',
      mintAddress: 'SF3oTvfWzEP3DTwGSvUXRrGTvr75pdZNnBLAH9bzMuX',
      tokenName: 'Wrapped SXP',
      icon:
        'https://github.com/trustwallet/assets/raw/b0ab88654fe64848da80d982945e4db06e197d4f/blockchains/ethereum/assets/0x8CE9137d39326AD0cD6491fb5CC0CbA0e089b6A9/logo.png',
    },
    {
      tokenSymbol: 'HGET',
      mintAddress: 'BtZQfWqDGbk9Wf2rXEiWyQBdBY1etnUUn6zEphvVS7yN',
      tokenName: 'Wrapped HGET',
    },
    {
      tokenSymbol: 'CREAM',
      mintAddress: '5Fu5UUgbjpUvdBveb3a1JTNirL8rXtiYeSMWvKjtUNQv',
      tokenName: 'Wrapped CREAM',
      icon:
        'https://raw.githubusercontent.com/trustwallet/assets/4c82c2a409f18a4dd96a504f967a55a8fe47026d/blockchains/smartchain/assets/0xd4CB328A82bDf5f03eB737f37Fa6B370aef3e888/logo.png',
    },
    {
      tokenSymbol: 'UBXT',
      mintAddress: '873KLxCbz7s9Kc4ZzgYRtNmhfkQrhfyWGZJBmyCbC3ei',
      tokenName: 'Wrapped UBXT',
    },
    {
      tokenSymbol: 'HNT',
      mintAddress: 'HqB7uswoVg4suaQiDP3wjxob1G5WdZ144zhdStwMCq7e',
      tokenName: 'Wrapped HNT',
    },
    {
      tokenSymbol: 'FRONT',
      mintAddress: '9S4t2NEAiJVMvPdRYKVrfJpBafPBLtvbvyS3DecojQHw',
      tokenName: 'Wrapped FRONT',
      icon:
        'https://raw.githubusercontent.com/trustwallet/assets/6e375e4e5fb0ffe09ed001bae1ef8ca1d6c86034/blockchains/ethereum/assets/0xf8C3527CC04340b208C854E985240c02F7B7793f/logo.png',
    },
    {
      tokenSymbol: 'AKRO',
      mintAddress: '6WNVCuxCGJzNjmMZoKyhZJwvJ5tYpsLyAtagzYASqBoF',
      tokenName: 'Wrapped AKRO',
      icon:
        'https://raw.githubusercontent.com/trustwallet/assets/878dcab0fab90e6593bcb9b7d941be4915f287dc/blockchains/ethereum/assets/0xb2734a4Cec32C81FDE26B0024Ad3ceB8C9b34037/logo.png',
    },
    {
      tokenSymbol: 'HXRO',
      mintAddress: 'DJafV9qemGp7mLMEn5wrfqaFwxsbLgUsGVS16zKRk9kc',
      tokenName: 'Wrapped HXRO',
    },
    {
      tokenSymbol: 'UNI',
      mintAddress: 'DEhAasscXF4kEGxFgJ3bq4PpVGp5wyUxMRvn6TzGVHaw',
      tokenName: 'Wrapped UNI',
      icon:
        'https://raw.githubusercontent.com/trustwallet/assets/08d734b5e6ec95227dc50efef3a9cdfea4c398a1/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png',
    },
    {
      tokenSymbol: 'MATH',
      mintAddress: 'GeDS162t9yGJuLEHPWXXGrb1zwkzinCgRwnT8vHYjKza',
      tokenName: 'Wrapped MATH',
    },
    {
      tokenSymbol: 'TOMO',
      mintAddress: 'GXMvfY2jpQctDqZ9RoU3oWPhufKiCcFEfchvYumtX7jd',
      tokenName: 'Wrapped TOMO',
      icon: "https://raw.githubusercontent.com/trustwallet/assets/08d734b5e6ec95227dc50efef3a9cdfea4c398a1/blockchains/tomochain/info/logo.png"
    },
    {
      tokenSymbol: 'LUA',
      mintAddress: 'EqWCKXfs3x47uVosDpTRgFniThL9Y8iCztJaapxbEaVX',
      tokenName: 'Wrapped LUA',
      icon: 'https://raw.githubusercontent.com/trustwallet/assets/2d2491130e6beda208ba4fc6df028a82a0106ab6/blockchains/ethereum/assets/0xB1f66997A5760428D3a87D68b90BfE0aE64121cC/logo.png',
    },
  ],
};

const customTokenNamesByNetwork = JSON.parse(
  localStorage.getItem('tokenNames') ?? '{}',
);

const nameUpdated = new EventEmitter();
nameUpdated.setMaxListeners(100);

export function useTokenName(mint) {
  const { endpoint } = useConnectionConfig();
  useListener(nameUpdated, 'update');

  if (!mint) {
    return { name: null, symbol: null };
  }

  let info = customTokenNamesByNetwork?.[endpoint]?.[mint.toBase58()];
  let match = TOKENS?.[endpoint]?.find(
    (token) => token.mintAddress === mint.toBase58(),
  );
  if (match && (!info || match.deprecated)) {
    info = { name: match.tokenName, symbol: match.tokenSymbol };
  }
  return { name: info?.name, symbol: info?.symbol };
}

export function useUpdateTokenName() {
  const { endpoint } = useConnectionConfig();
  return useCallback(
    function updateTokenName(mint, name, symbol) {
      if (!name || !symbol) {
        if (name) {
          symbol = name;
        } else if (symbol) {
          name = symbol;
        } else {
          return;
        }
      }
      if (!customTokenNamesByNetwork[endpoint]) {
        customTokenNamesByNetwork[endpoint] = {};
      }
      customTokenNamesByNetwork[endpoint][mint.toBase58()] = { name, symbol };
      localStorage.setItem(
        'tokenNames',
        JSON.stringify(customTokenNamesByNetwork),
      );
      nameUpdated.emit('update');
    },
    [endpoint],
  );
}
