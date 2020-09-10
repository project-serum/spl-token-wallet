import React from 'react';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

export default function MatchOrder({ instruction }) {
  const { data, marketName } = instruction;

  return (
    <>
      <Typography
        variant="subtitle1"
        style={{ fontWeight: 'bold' }}
        gutterBottom
      >
        - Match orders on market {marketName}
      </Typography>
      {data?.limit && (
        <List>
          <ListItemText primary="Limit" secondary={'x' + data.limit} />
        </List>
      )}
    </>
  );
}
