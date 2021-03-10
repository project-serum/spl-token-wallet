import React from 'react';
import {
  Card,
  Input,
  Row,
  Body,
  TextButton,
  Img,
  Title,
  VioletButton,
  CardButton,
  BoldTitle,
} from '../commonStyles';

import Plus from '../../images/AddButton.svg';
import Import from '../../images/ImportButton.svg';
import Restore from '../../images/RestoreButton.svg';
import Logo from '../../images/logo.svg';

export const WelcomePage = () => {
  return (
    <Body>
      {' '}
      <Img>
        {' '}
        <img src={Logo} width="100%" height="100%" />
      </Img>
      <Row>
        <Row>
          {' '}
          <a href={'/create_wallet'}>
            <CardButton width="35rem" height="35rem" margin={'0 2rem 0 0'}>
              <Row
                direction={'column'}
                justify={'space-around'}
                height={'100%'}
              >
                <Img width="12rem" height="12rem">
                  {' '}
                  <img src={Plus} width="100%" height="100%" />
                </Img>
                <BoldTitle>Create New Wallet</BoldTitle>
              </Row>
            </CardButton>
          </a>
        </Row>

        <Row direction={'column'} justify={'space-between'} height={'100%'}>
          {' '}
          <a href={'/restore_wallet'}>
            <CardButton width="35rem" height="16.5rem">
              <Row width={'80%'} justify={'space-between'}>
                {' '}
                <Img width="9rem" height="9rem">
                  {' '}
                  <img src={Restore} width="100%" height="100%" />
                </Img>
                <Row
                  direction={'column'}
                  justify={'center'}
                  align={'end'}
                  width={'60%'}
                >
                  {' '}
                  <BoldTitle>Restore Existing Wallet </BoldTitle>
                  <Title>by seed phrase</Title>{' '}
                </Row>
              </Row>
            </CardButton>
          </a>
          <a href={'/import_wallet'}>
            <CardButton width="35rem" height="16.5rem">
              <Row width={'80%'} justify={'space-between'}>
                {' '}
                <Img width="9rem" height="9rem">
                  {' '}
                  <img src={Import} width="100%" height="100%" />
                </Img>
                <Row
                  direction={'column'}
                  justify={'center'}
                  align={'end'}
                  width={'60%'}
                >
                  {' '}
                  <BoldTitle>Import Wallet</BoldTitle>
                  <Title>using private key</Title>{' '}
                </Row>
              </Row>
            </CardButton>
          </a>
        </Row>
      </Row>
    </Body>
  );
};
