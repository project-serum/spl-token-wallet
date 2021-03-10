import React, { useState } from 'react';

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

import Eye from '../../images/Eye.svg';
import Logo from '../../images/logo.svg';

export const RestorePage = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Body>
      {' '}
      <Img>
        {' '}
        <img src={Logo} width="100%" height="100%" />
      </Img>
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
            <Title>Restore your wallet using your 12 seed words.</Title>
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
            {' '}
            <Input type="text" placeholder="Paste your private key"></Input>
            <TextButton
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
            </TextButton>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Create Password"
            ></Input>
            <Img
              onClick={() => {
                setShowPassword(!showPassword);
              }}
              style={{
                position: 'absolute',
                right: '5rem',
                top: '9.6rem',
                cursor: 'pointer',
              }}
              width={'2rem'}
              height={'2rem'}
            >
              <img width="100%" height="100%" src={Eye} />
            </Img>
          </RowContainer>
          <Row width={'90%'} height={'20%'} justify={'space-between'}>
            <a style={{ width: '50%', textAlign: 'center' }} href="/welcome">
              <TextButton>Cancel</TextButton>
            </a>
            <VioletButton width={'50%'}>Restore</VioletButton>
          </Row>
        </RowContainer>
      </Card>
    </Body>
  );
};
