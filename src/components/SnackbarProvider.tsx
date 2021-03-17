import React from 'react';
import { SnackbarProvider } from 'notistack';
import { withStyles } from '@material-ui/styles';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import errorIcon from '../images/errorIcon.svg';
import successIcon from '../images/successIcon.svg';
import infoIcon from '../images/infoIcon.svg';

const canselStyeles = (theme) => ({
  icon: {
    fontSize: 20,
  },
});

const CloseButton = withStyles(canselStyeles)((props: any) => (
  <IconButton key="close" aria-label="Close" color="inherit">
    <CloseIcon className={props.classes.icon} />
  </IconButton>
));

const snackStyles: any = {
  success: {
    color: '#fff',
    fontSize: '1.6rem',
    fontWeight: 'bold',
    // backgroundColor: theme.customPalette.green.main,
    background: 'rgba(22, 37, 61, 0.95)',
    boxShadow: '0px 0px 32px rgba(8, 22, 58, 0.1)',
    backdropFilter: 'blur(4px)',
    borderRadius: '16px',
    flexGrow: 0,
  },
  error: {
    color: '#fff',
    fontSize: '1.6rem',
    fontWeight: 'bold',
    // backgroundColor: theme.customPalette.red.main,
    background: 'rgba(22, 37, 61, 0.95)',
    boxShadow: '0px 0px 32px rgba(8, 22, 58, 0.1)',
    backdropFilter: 'blur(4px)',
    borderRadius: '16px',
    flexGrow: 0,
  },
};

const IntegrationNotistack = ({ ...props }) => {
  return (
    <SnackbarProvider
      iconVariant={{
        success: (
          <img
            src={successIcon}
            alt="success"
            style={{
              marginRight: '.8rem',
              width: '3.5rem',
              height: 'auto',
            }}
          />
        ),
        error: (
          <img
            src={errorIcon}
            alt="error"
            style={{
              marginRight: '.8rem',
              width: '3.5rem',
              height: 'auto',
            }}
          />
        ),
        info: (
          <img
            src={infoIcon}
            alt="info"
            style={{
              marginRight: '.8rem',
              width: '3.5rem',
              height: 'auto',
            }}
          />
        ),
      }}
      maxSnack={3}
      autoHideDuration={3000}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      action={<CloseButton />}
      classes={{
        variantSuccess: snackStyles.success,
        variantError: snackStyles.error,
        variantInfo: snackStyles.success,
      }}
    >
      {props.children}
    </SnackbarProvider>
  );
};

export default IntegrationNotistack;
