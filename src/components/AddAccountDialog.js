import React, { useState } from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogForm from './DialogForm';

export default function AddAccountDialog({ open, onAdd, onClose }) {
  const [name, setName] = useState('');

  return (
    <DialogForm
      open={open}
      onClose={onClose}
      onSubmit={() => onAdd(name)}
      fullWidth
    >
      <DialogTitle>Add account</DialogTitle>
      <DialogContent style={{ paddingTop: 16 }}>
        <TextField
          label="Name"
          fullWidth
          variant="outlined"
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value.trim())}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button type="submit" color="primary" disabled={!name}>
          Add
        </Button>
      </DialogActions>
    </DialogForm>
  );
}
