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
        <Row direction={'column'} justify={'space-between'} height={'75%'}>
          <Row direction={'column'} justify={'space-around'} height={'20%'}>
            <Title>Import your wallet using your 12 seed words.</Title>
            <Title>
              Note that this will delete any existing wallet on this device.
            </Title>
          </Row>
          <Row
            direction={'column'}
            height={'50%'}
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
                top: '2rem',
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
          </Row>
          <Row width={'90%'} height={'20%'} justify={'space-between'}>
            <a style={{ width: '100%' }} href="/welcome">
              <TextButton>Cancel</TextButton>
            </a>
            <VioletButton>Import</VioletButton>
          </Row>
        </Row>
      </Card>
    </Body>
  );
};
