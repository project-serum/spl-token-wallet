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
} from '../RestoreWallet/styles';
import { ProgressBar } from './styles';
import Logo from '../../images/logo.svg';

export const CreateWalletPage = () => {
  return (
    <Body>
      {' '}
      <Img>
        {' '}
        <img src={Logo} width="100%" height="100%" />
      </Img>
      <Card>
        <Row
          direction={'column'}
          justify={'space-between'}
          height={'75%'}
        ></Row>
      </Card>
    </Body>
  );
};
