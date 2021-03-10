import React, { useState } from 'react';
import Eye from '../../images/Eye.svg';

import {
  Card,
  Input,
  Body,
  TextButton,
  Row,
  Img,
  Title,
  VioletButton,
  RowContainer,
} from '../commonStyles';

import Logo from '../../components/Logo';
import { InputWithEye, InputWithPaste } from '../../components/Input';

export const ImportPage = () => {
  const [password, setPassword] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
              onPasteClick={() => setPrivateKey('ararra')}
            />
            {/* <TextButton
              style={{
                position: 'absolute',
                right: '4rem',
                top: '3.4rem',
                cursor: 'pointer',
              }}
              color={'#406EDC'}
              width={'5rem'}
            >
              Paste
            </TextButton> */}
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
            <a style={{ width: '50%', textAlign: 'center' }} href="/welcome">
              <TextButton>Cancel</TextButton>
            </a>
            <VioletButton width={'50%'}>Import</VioletButton>
          </Row>
        </RowContainer>
      </Card>
    </Body>
  );
};
