import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

export default function DialogForm({
  open,
  onClose,
  onSubmit,
  children,
  ...rest
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <Dialog
      open={open}
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
    >
      {children}
    </Dialog>
  );
}
