import React, { useState } from 'react';
import DialogForm from './DialogForm';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';

export default function EditAccountNameDialog({
  open,
  oldName,
  onClose,
  onEdit,
}) {
  const [name, setName] = useState(oldName);
  return (
    <DialogForm
      open={open}
      onEnter={() => setName(oldName)}
      onClose={onClose}
      onSubmit={() => onEdit(name.trim())}
      fullWidth
    >
      <DialogTitle>Edit Account</DialogTitle>
      <DialogContent>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <TextField
            label="Name"
            fullWidth
            variant="outlined"
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button type="submit" color="primary">
          Save
        </Button>
      </DialogActions>
    </DialogForm>
  );
}
