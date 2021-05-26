import React, { useEffect } from 'react';
import CardContent from '@material-ui/core/CardContent';
import Warning from '@material-ui/icons/Warning';
import { Tooltip, Typography, Divider } from '@material-ui/core';
import { useWallet } from '../utils/wallet';

export default function SignFormContent({
  origin,
  message,
  messageDisplay,
  buttonRef,
}) {
  useEffect(() => {
    // brings window to front when we receive new instructions
    // this needs to be executed from wallet instead of adapter
    // to ensure chrome brings window to front
    window.focus();

    // Scroll to approve button and focus it to enable approve with enter.
    // Keep currentButtonRef in local variable, so the reference can't become
    // invalid until the timeout is over. this was happening to all auto-
    // approvals for unknown reasons.
    let currentButtonRef = buttonRef.current;
    if (currentButtonRef) {
      currentButtonRef.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => currentButtonRef.focus(), 50);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buttonRef]);

  const wallet = useWallet();

  let messageTxt = new TextDecoder().decode(message);

  const renderAction = () => {
    return `Sign message with account ${wallet.publicKey}`;
  };

  return (
    <CardContent>
      <Typography variant="h6" gutterBottom>
        {`${origin} wants to:`}
      </Typography>
      <Typography
        variant="subtitle1"
        style={{ fontWeight: 'bold' }}
        gutterBottom
      >
        {renderAction()}
      </Typography>
      <Divider style={{ margin: 20 }} />
      <Typography style={{ wordBreak: 'break-all' }}>{messageTxt}</Typography>
      <Divider style={{ margin: 20 }} />
    </CardContent>
  );
}
