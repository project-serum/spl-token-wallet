import React, { useState } from 'react';

import AccountInfo from './components/AccountInfo';
import AssetsTable from './components/AssetsTable';
import SendDialog from './components/SendPopup';
import ReceiveDialog from './components/ReceivePopup';
import AddTokenDialog from './components/AddTokenPopup';

import { RowContainer } from '../commonStyles';

const Wallet = () => {
  const [selectedPublicKey, selectPublicKey] = useState<any>(null);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [showAddTokenDialog, setShowAddTokenDialog] = useState(false);

  // const [tokenInfoDialogOpen, setTokenInfoDialogOpen] = useState(false);
  // const [exportAccDialogOpen, setExportAccDialogOpen] = useState(false);
  // const [
  //   closeTokenAccountDialogOpen,
  //   setCloseTokenAccountDialogOpen,
  // ] = useState(false);

  return (
    <RowContainer direction="column" height="100%" padding="0 3rem 3rem 3rem">
      <AccountInfo />
      <AssetsTable
        selectPublicKey={selectPublicKey}
        setSendDialogOpen={setSendDialogOpen}
        setDepositDialogOpen={setDepositDialogOpen}
        setShowAddTokenDialog={setShowAddTokenDialog}
      />

      <SendDialog
        open={sendDialogOpen}
        onClose={() => setSendDialogOpen(false)}
        publicKey={selectedPublicKey}
      />
      <ReceiveDialog
        open={depositDialogOpen}
        onClose={() => setDepositDialogOpen(false)}
        publicKey={selectedPublicKey}
      />

      <AddTokenDialog
        open={showAddTokenDialog}
        onClose={() => setShowAddTokenDialog(false)}
      />

      {/* 
      <TokenInfoDialog
        open={tokenInfoDialogOpen}
        onClose={() => setTokenInfoDialogOpen(false)}
        publicKey={selectedPublicKey}
      />
      <CloseTokenAccountDialog
        open={closeTokenAccountDialogOpen}
        onClose={() => setCloseTokenAccountDialogOpen(false)}
        publicKey={selectedPublicKey}
      /> */}
    </RowContainer>
  );
};

export default Wallet;
