import React from 'react';
import styled from 'styled-components';

import { Row, RowContainer } from '../pages/commonStyles';
import { BtnCustom } from '../components/BtnCustom';
import DialogForm from '../pages/Wallet/components/DialogForm';
import { useTheme, Paper } from '@material-ui/core';
import SunLogo from '../images/SunLogo.svg';

export const StyledPaper = styled(({ ...props }) => <Paper {...props} />)`
  height: auto;
  padding: 2rem 4rem;
  width: 65rem;
  box-shadow: 0px 0px 0.8rem 0px rgba(0, 0, 0, 0.45);
  background: #222429;
  border-radius: 0.8rem;
`;

const BoldHeader = styled.h1`
  font-family: Avenir Next Bold;
  font-size: 2.5rem;
  letter-spacing: -1.04615px;
  color: #f5f5fb;
`;

const Text = styled.span`
  font-size: ${(props) => props.fontSize || '1.5rem'};
  padding-bottom: ${(props) => props.paddingBottom || ''};
  text-transform: none;
  font-family: ${(props) => props.fontFamily || 'Avenir Next Medium'};
  color: ${(props) => props.color || '#ecf0f3'};
`;

const BlueButton = styled(
  ({ isUserConfident, showLoader, children, ...props }) => (
    <BtnCustom {...props}>{children}</BtnCustom>
  ),
)`
  font-size: 1.4rem;
  height: 4.5rem;
  text-transform: capitalize;
  background-color: #366ce5;
  border-radius: 1rem;
  border-color: none;
  cursor: pointer;
  color: #fbf2f2;
  border: none;
  &:hover {
    background-color: #366ce5;
  }
`;

export const MigrationToNewUrlPopup = ({
  open,
  close,
}: {
  open: boolean;
  close: () => void;
}) => {
  const theme = useTheme();

  return (
    <DialogForm
      theme={theme}
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={() => close()}
      maxWidth={'md'}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <Row justify={'space-between'} width={'100%'}>
        <BoldHeader>CCAI Wallet is SunWallet now!</BoldHeader>
        <img
          alt="Warning."
          style={{ width: '15rem', height: 'auto' }}
          src={SunLogo}
        />
      </Row>
      <RowContainer margin={'3rem 0'} align={'start'} direction={'column'}>
        <Text style={{ margin: '1.5rem 0' }}>
          Our wallet has changed its name and moved to a new domain:
          SunWallet.io
        </Text>
        <Text style={{ margin: '1.5rem 0' }}>
          For old users almost nothing will change, your accounts and seed
          phrases will remain the same. The old domain will redirect to the new
          domain.
        </Text>
        <Text style={{ margin: '1.5rem 0' }}>
          Stay tuned for more updates! Let’s build the best DeFi experience
          together!
        </Text>
      </RowContainer>
      <RowContainer justify="flex-start" margin={'3rem 0 2rem 0'}>
        {' '}
        <BlueButton
          style={{
            width: '30%',
            fontFamily: 'Avenir Next Medium',
            textTransform: 'none',
            color: '#fbf2f2',
          }}
          isUserConfident={true}
          theme={theme}
          onClick={() => {
            close();
            localStorage.setItem('isMigrationToNewUrlPopupDone', 'true');
          }}
        >
          {' '}
          Got it!
        </BlueButton>
      </RowContainer>
    </DialogForm>
  );
};
