import React, { useState } from 'react';
import { Link } from 'react-router-dom'

import {
  Card,
  Body,
  Row,
  Title,
  VioletButton,
  WhiteButton,
  RowContainer,
} from '../commonStyles';

import Logo from '../../components/Logo';
import { InputWithEye, InputWithPaste } from '../../components/Input';
import BottomLink from '../../components/BottomLink'
import { useTheme } from '@material-ui/core';

export const ImportPage = () => {
  const [password, setPassword] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const theme = useTheme()

  return (
    <Body>
      <Logo />
      <Card>
        <RowContainer
          direction={'column'}
          justify={'space-between'}
          height={'75%'}
        >
          <RowContainer
            direction={'column'}
            justify={'space-around'}
            height={'20%'}
          >
            <Title>Import your wallet using your 12 seed words.</Title>
            <Title>
              Note that this will delete any existing wallet on this device.
            </Title>
          </RowContainer>
          <RowContainer
            direction={'column'}
            height={'50%'}
            justify={'space-evenly'}
            style={{ position: 'relative' }}
          >
            <InputWithPaste
              type="text"
              placeholder="Paste your private key"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              onPasteClick={() =>
                navigator.clipboard
                  .readText()
                  .then((clipText) => setPrivateKey(clipText))
              }
            />
            <InputWithEye
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              showPassword={showPassword}
              onEyeClick={() => setShowPassword(!showPassword)}
              type={showPassword ? 'text' : 'password'}
              placeholder="Create Password"
            />
          </RowContainer>
          <Row width={'90%'} height={'20%'} justify={'space-between'}>
            <Link style={{ width: 'calc(50% - .5rem)' }} to="/">
              <WhiteButton width={'100%'} theme={theme}>Cancel</WhiteButton>
            </Link>
            <VioletButton width={'calc(50% - .5rem)'}>Import</VioletButton>
          </Row>
        </RowContainer>
      </Card>
      <BottomLink to={'/create_wallet'} toText={'Create Wallet'} />
    </Body>
  );
};
