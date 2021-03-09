import React from 'react';
import {
  Card,
  Input,
  Body,
  TextButton,
  Row,
  Img,
  Title,
  VioletButton,
} from './styles';

import Logo from '../../images/logo.svg';

export const RestorePage = () => {
  return (
    <Body>
      {' '}
      <Img>
        {' '}
        <img src={Logo} width="100%" height="100%" />
      </Img>
      <Card>
        <Row direction={'column'} justify={'space-between'} height={'75%'}>
          <Row direction={'column'} justify={'space-around'} height={'20%'}>
            <Title>Restore your wallet using your 12 seed words.</Title>
            <Title>
              Note that this will delete any existing wallet on this device.
            </Title>
          </Row>
          <Row direction={'column'} height={'50%'}>
            {' '}
            <Input type="text" placeholder="Paste your private key"></Input>
            <Input type="text" placeholder="Create Password"></Input>
          </Row>
          <Row width={'90%'} height={'20%'} justify={'space-between'}>
            <TextButton>Cancel</TextButton>
            <VioletButton>Import</VioletButton>
          </Row>
        </Row>
      </Card>
    </Body>
  );
};
