import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogForm from './DialogForm';
import TextField from '@material-ui/core/TextField';

export default function CustomEndpointsDialog({
  customEndpoints,
  open,
  onAdd,
  onRemove,
  onClose,
}) {
  const [userInput, setUserInput] = useState('');

  return (
    <DialogForm
      open={open}
      onEnter={() => {}}
      onClose={() => {
        onClose();
      }}
      fullWidth
    >
      <DialogTitle>Manage Custom Endpoints</DialogTitle>
      <DialogContent>
        {customEndpoints.map((endpoint) => {
          return (
            <div key={endpoint}>
              {endpoint}{' '}
              <Button
                type="submit"
                color="primary"
                onClick={() => onRemove(endpoint)}
              >
                Remove
              </Button>
            </div>
          );
        })}
        <div style={{ display: 'flex', paddingTop: '16px' }}>
          <TextField
            label="Custom Endpoint"
            fullWidth
            variant="outlined"
            placeholder="e.g. https://solana-api.projectserum.com"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            style={{ marginRight: '16px' }}
          />
          <Button
            type="submit"
            color="primary"
            onClick={() => onAdd(userInput)}
          >
            Add
          </Button>
        </div>

        <div
          style={{
            padding: '16px 0 4px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Button
            onClick={() => {
              setUserInput('');
              onClose();
            }}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </DialogForm>
  );
}
