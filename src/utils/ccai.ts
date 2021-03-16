import dayjs from 'dayjs'

export const getMarketsData = async () => {
  const getSerumMarketData = `
  query getSerumMarketData(
      $publicKey: String!
      $exchange: String!
      $marketType: Int!
      $startTimestamp: String!
      $endTimestamp: String!
      $prevStartTimestamp: String!
      $prevEndTimestamp: String!
    ) {
      getSerumMarketData(
        publicKey: $publicKey
        exchange: $exchange
        marketType: $marketType
        startTimestamp: $startTimestamp
        endTimestamp: $endTimestamp
        prevStartTimestamp: $prevStartTimestamp
        prevEndTimestamp: $prevEndTimestamp
      ) {
        symbol
        tradesCount
        tradesDiff
        volume
        volumeChange
        minPrice
        maxPrice
        closePrice
        precentageTradesDiff
        lastPriceDiff
        isCustomUserMarket
        isPrivateCustomMarket
        address
        programId
      }
    }
`;

  const datesForQuery = {
    startOfTime: dayjs().startOf('hour').subtract(24, 'hour').unix(),

    endOfTime: dayjs().endOf('hour').unix(),

    prevStartTimestamp: dayjs().startOf('hour').subtract(48, 'hour').unix(),

    prevEndTimestamp: dayjs().startOf('hour').subtract(24, 'hour').unix(),
  };

  return await fetch('https://develop.api.cryptocurrencies.ai/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      operationName: 'getSerumMarketData',
      variables: {
        exchange: 'serum',
        marketType: 0,
        publicKey: '',
        startTimestamp: `${datesForQuery.startOfTime}`,
        endTimestamp: `${datesForQuery.endOfTime}`,
        prevStartTimestamp: `${datesForQuery.prevStartTimestamp}`,
        prevEndTimestamp: `${datesForQuery.prevEndTimestamp}`,
      },
      query: getSerumMarketData,
    }),
  })
    .then((data) => data.json())
    .then((data) => {
      const map = new Map();

      if (data && data.data && data.data.getSerumMarketData) {
        data.data.getSerumMarketData.forEach((market) => {
          map.set(market.symbol, market);
        });
      }

      return map;
    });
};