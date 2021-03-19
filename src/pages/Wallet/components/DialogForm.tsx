import React from 'react';
import { Dialog } from '@material-ui/core';
import { Card } from '../../commonStyles';

export default function DialogForm({
  open,
  onClose,
  onSubmit = () => {},
  ...rest
}) {
  // const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <Dialog
      open={open}
      PaperComponent={Card}
      PaperProps={{
        component: 'form',
        onSubmit: (e) => {
          e.preventDefault();
          if (onSubmit) {
            onSubmit();
          }
        },
        // @ts-ignore
        height: rest.height,
        width: rest.width,
        padding: rest.padding,
      }}
      onClose={onClose}
      // fullScreen={fullScreen}
      {...rest}
    />
  );
}
