import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Dialog } from '@material-ui/core';
import { Card } from '../../commonStyles';

export default function DialogForm({
  open,
  onClose,
  onSubmit = () => {},
  ...rest
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <Dialog
      open={open}
      PaperComponent={() => <Card {...rest} />}
      PaperProps={{
        component: 'form',
        onSubmit: (e) => {
          e.preventDefault();
          if (onSubmit) {
            onSubmit();
          }
        },
      }}
      onClose={onClose}
      fullScreen={fullScreen}
      {...rest}
    />
  );
}
