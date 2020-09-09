import React from 'react';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { MARKET_INFO_BY_ADDRESS } from '../../utils/markets';

export default function CancelOrder({ origin, instruction }) {
  const { data, market } = instruction;
  const { side, orderId } = data;

  const marketAddress = market?._decoded?.ownAddress?.toBase58();
  const marketName = marketAddress && MARKET_INFO_BY_ADDRESS[marketAddress];

  return (
    <>
      <Typography variant="h6" component="h1" gutterBottom>
        {origin} would like to cancel an order:
      </Typography>
      <List>
        <ListItemText primary="Market" secondary={marketName} />
        <ListItemText primary="Order Id" secondary={orderId + ''} />
        <ListItemText
          primary="Side"
          secondary={side.charAt(0).toUpperCase() + side.slice(1)}
        />
      </List>
    </>
  );
}
