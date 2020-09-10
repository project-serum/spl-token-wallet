import React from 'react';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

export default function Neworder({ instruction }) {
  const { data, market, marketName } = instruction;
  const { side, limitPrice, maxQuantity, orderType } = data;

  return (
    <>
      <Typography
        variant="subtitle1"
        style={{ fontWeight: 'bold' }}
        gutterBottom
      >
        Place an order:
      </Typography>
      <List>
        <ListItemText primary="Market" secondary={marketName} />
        <ListItemText
          primary="Side"
          secondary={side.charAt(0).toUpperCase() + side.slice(1)}
        />
        <ListItemText
          primary="Price"
          secondary={market.priceLotsToNumber(limitPrice)}
        />
        <ListItemText
          primary="Quantity"
          secondary={market.baseSizeLotsToNumber(maxQuantity)}
        />
        <ListItemText
          primary="Type"
          secondary={orderType.charAt(0).toUpperCase() + orderType.slice(1)}
        />
        {instruction.clientId && (
          <ListItemText
            primary="Client ID"
            secondary={instruction.clientId + ''}
          />
        )}
      </List>
    </>
  );
}
