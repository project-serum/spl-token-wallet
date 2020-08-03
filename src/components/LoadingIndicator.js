import React, { useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useEffectAfterTimeout } from '../utils/utils';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    padding: theme.spacing(2),
  },
}));

export default function LoadingIndicator({
  height = null,
  delay = 500,
  ...rest
}) {
  const classes = useStyles();
  const [visible, setVisible] = useState(false);

  useEffectAfterTimeout(() => setVisible(true), delay);

  let style = {};
  if (height) {
    style.height = height;
  }

  if (!visible) {
    return height ? <div style={style} /> : null;
  }

  return (
    <div className={classes.root} style={style} {...rest}>
      <CircularProgress />
    </div>
  );
}
