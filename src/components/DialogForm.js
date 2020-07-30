import React from 'react';
import Dialog from '@material-ui/core/Dialog';

export default function DialogForm({
  open,
  onClose,
  onSubmit,
  children,
  ...rest
}) {
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
      {...rest}
    >
      {children}
    </Dialog>
  );
}
