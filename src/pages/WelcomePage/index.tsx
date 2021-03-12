import React from 'react';
import {
  Row,
  Body,
  Img,
  Title,
  CardButton,
  BoldTitle,
  RowContainer,
} from '../commonStyles';

import Plus from '../../images/AddButton.svg';
// import Import from '../../images/ImportButton.svg';
import Restore from '../../images/RestoreButton.svg';
import Logo from '../../components/Logo'


export const WelcomePage = () => {
  return (
    <Body>
      <Logo />
      <Row>
        <Row>
          <a href={'/create_wallet'}>
            <CardButton width="35rem" height="35rem" margin={'0 2rem 0 0'}>
              <Row
                direction={'column'}
                justify={'space-around'}
                height={'100%'}
              >
                <Img width="12rem" height="12rem">
                  <img src={Plus} alt={'plus, add'} width="100%" height="100%" />
                </Img>
                <BoldTitle>Create New Wallet</BoldTitle>
              </Row>
            </CardButton>
          </a>
        </Row>

        <Row direction={'column'} justify={'space-between'} height={'100%'}>
          <a href={'/restore_wallet'}>
            <CardButton width="35rem" height="35rem">
              <Row justify={'space-around'} direction={'column'} height={'100%'}>
                <Img width="12rem" height="12rem">
                  <img src={Restore} alt={'restore'}  width="100%" height="100%" />
                </Img>
                <RowContainer direction={'column'}>
                  <BoldTitle>Restore Existing Wallet </BoldTitle>
                  <Title>by seed phrase</Title>
                </RowContainer>
              </Row>
            </CardButton>
          </a>
          {/* <a href={'/import_wallet'}>
            <CardButton width="35rem" height="16.5rem">
              <Row width={'80%'} justify={'space-between'}>
                {' '}
                <Img width="9rem" height="9rem">
                  {' '}
                  <img src={Import} width="100%" height="100%" alt={'import'} />
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
          </a> */}
        </Row>
      </Row>
    </Body>
  );
};
