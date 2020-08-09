import React, { useRef } from 'react';
import { Button, TextField } from '@material-ui/core';
import CopyIcon from 'mdi-material-ui/ContentCopy';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  button: {
    marginLeft: theme.spacing(3),
    whiteSpace: 'nowrap',
    marginTop: theme.spacing(2),
  },
  buttonIcon: {
    marginRight: theme.spacing(1),
  },
}));

export default function CopyableDisplay({
  value,
  label,
  autoFocus,
  buttonProps,
  helperText,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const textareaRef = useRef();
  const classes = useStyles();
  const copyLink = () => {
    let textArea = textareaRef.current;
    if (textArea) {
      textArea.select();
      document.execCommand('copy');
      enqueueSnackbar(`Copied ${label}`, {
        variant: 'info',
        autoHideDuration: 2500,
      });
    }
  };

  return (
    <div className={classes.root}>
      <TextField
        inputRef={(ref) => (textareaRef.current = ref)}
        multiline
        autoFocus={autoFocus}
        value={value}
        readOnly
        onFocus={(e) => e.currentTarget.select()}
        className={classes.textArea}
        fullWidth
        helperText={helperText}
        label={label}
        spellCheck={false}
      />
      <Button
        variant="contained"
        onClick={copyLink}
        className={classes.button}
        {...buttonProps}
      >
        <CopyIcon className={classes.buttonIcon} /> {'Copy'}
      </Button>
    </div>
  );
}
