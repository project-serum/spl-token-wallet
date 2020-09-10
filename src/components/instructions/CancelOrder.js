import React from 'react';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

export default function CancelOrder({ instruction }) {
  const { data, marketName } = instruction;
  const { side, orderId } = data;

  return (
    <>
      <Typography
        variant="subtitle1"
        style={{ fontWeight: 'bold' }}
        gutterBottom
      >
        - Cancel an order:
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
