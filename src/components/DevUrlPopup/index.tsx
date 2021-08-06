import React from 'react';
import styled from 'styled-components';

import { Row, RowContainer } from '../../pages/commonStyles';
import Warning from '../../images/newWarning.svg';
import { BtnCustom } from '../BtnCustom';
import DialogForm from '../../pages/Wallet/components/DialogForm';
import { useTheme, Paper } from '@material-ui/core';

export const StyledPaper = styled(({ ...props }) => <Paper {...props} />)`
  height: auto;
  padding: 2rem 4rem;
  width: 55rem;
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

export const Text = styled.span`
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

export const DevUrlPopup = ({
  open,
  close,
}: {
  open: boolean;
  close: () => void;
}) => {
  const theme = useTheme();

  document.addEventListener('keydown', function (event) {
    if (event.code === 'KeyB' && (event.ctrlKey || event.metaKey)) {
      close();
    }
  });

  return (
    <DialogForm
      theme={theme}
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={() => {}}
      maxWidth={'md'}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <Row justify={'space-between'} width={'100%'}>
        <BoldHeader>Warning!</BoldHeader>
        <img
          alt="Warning."
          style={{ width: '4rem', height: '4rem' }}
          src={Warning}
          onClick={close}
        />
      </Row>
      <RowContainer margin={'3rem 0'} align={'start'} direction={'column'}>
        <BoldHeader style={{ textAlign: 'left', marginBottom: '6rem' }}>
          Hello, this page is for developers only.
        </BoldHeader>
        <Text>
          To avoid loss of funds or cunfusing situations, please leave it. You
          probably wanted to get to
          <a
            style={{
              padding: '0 0 0 0.5rem',
              color: '#A5E898',
              textDecoration: 'none',
            }}
            target="_blank"
            rel="noopener noreferrer"
            href={'https://wallet.cryptocurrencies.ai'}
          >
            wallet.cryptocurrencies.ai{' '}
          </a>
          .
        </Text>
      </RowContainer>
      <RowContainer justify="space-between" margin={'3rem 0 2rem 0'}>
        <a
          style={{ textDecoration: 'none', width: '100%' }}
          target="_blank"
          rel="noopener noreferrer"
          href={'https://wallet.cryptocurrencies.ai'}
        >
          {' '}
          <BlueButton
            style={{
              width: '100%',
              fontFamily: 'Avenir Next Medium',
              textTransform: 'none',
              color: '#fbf2f2',
            }}
            isUserConfident={true}
            theme={theme}
            onClick={() => {}}
          >
            Go to wallet.cryptocurrencies.ai
          </BlueButton>
        </a>
      </RowContainer>
    </DialogForm>
  );
};
