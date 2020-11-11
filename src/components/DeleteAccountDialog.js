import React from "react";
import DialogForm from "./DialogForm";
import {forgetWallet} from "../utils/wallet-seed";
import DialogTitle from "@material-ui/core/DialogTitle";
import {DialogContentText} from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

export default function DeleteAccountDialog({open, onClose, isDeleteAccountEnabled}) {
  return (
    <>
      <DialogForm
        open={open}
        onClose={onClose}
        onSubmit={forgetWallet}
        fullWidth
      >
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContentText style={{ margin: 20 }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            You will not be able to recover this account without either the seed phrase, or
            the account private key.<br/><br/>

            <strong style={{textAlign: 'center'}}>
              Please ensure you have either the seed phrase or the private key to prevent loss of funds.
            </strong>
          </div>
        </DialogContentText>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
          <Button type="submit" color="secondary" disabled={!isDeleteAccountEnabled}>
            Delete Account
          </Button>
        </DialogActions>
      </DialogForm>
    </>
  );
}
