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
  BoldTitle,
  CardButton,
  Percent,
  ProgressBar,
  ProgressBarContainer,
  Step,
  Steps,
  ColorText,
  ContainerForIcon,
  Textarea,
} from '../commonStyles';

import Eye from '../../images/Eye.svg';
import Attention from '../../images/attention.svg';
import Copy from '../../images/copy.svg';
import Logo from '../../images/logo.svg';

export const CreateWalletPage = () => {
  const [currentStep, setCurrentStep] = useState('1');
  const [showPassword, setShowPassword] = useState(false);
  const [isSpeedPhase, setSpeedPhaseOn] = useState(false);

  return (
    <Body>
      {' '}
      <Row direction={'column'}>
        <Img height={'10rem'}>
          {' '}
          <img src={Logo} width="100%" height="100%" />
        </Img>
        <Row
          direction={'row'}
          justify={'flex-start'}
          align={'baseline'}
          height={'10%'}
          margin={'0 0 3rem 0'}
        >
          <ProgressBarContainer>
            <ProgressBar currentStep={currentStep}>
              <Percent />
            </ProgressBar>

            <Steps isCompleted={currentStep === '3'}>
              <div>
                {' '}
                <Step
                  isCompleted={+currentStep > 1}
                  isSelected={currentStep === '1'}
                  onClick={() => {
                    setCurrentStep('1');
                  }}
                  id="1"
                >
                  1
                </Step>
                <Title
                  style={{
                    position: 'absolute',
                    width: '10rem',
                    right: '33rem',
                    top: '2rem',
                  }}
                >
                  Create Password
                </Title>
              </div>
              <div>
                <Step
                  isCompleted={+currentStep > 2}
                  isSelected={currentStep === '2'}
                  onClick={() => {
                    setCurrentStep('2');
                  }}
                  id="2"
                >
                  2
                </Step>
                <Title
                  style={{
                    position: 'absolute',
                    width: '12rem',
                    right: '14rem',
                    top: '2rem',
                  }}
                >
                  Confirm Seed Phrase
                </Title>
              </div>
              <div>
                <Step
                  isSelected={currentStep === '3'}
                  onClick={() => {
                    setCurrentStep('3');
                  }}
                  id="3"
                >
                  3
                </Step>
                <Title
                  style={{
                    position: 'absolute',
                    width: '7rem',
                    left: '35rem',
                    top: '2rem',
                  }}
                >
                  Add Tokens
                </Title>
              </div>
            </Steps>
          </ProgressBarContainer>
        </Row>
        {currentStep === '1' ? (
          <Card>
            <Row direction={'column'}>
              <BoldTitle style={{ marginBottom: '1.5rem' }}>
                Create a password or type your addressbook
              </BoldTitle>
              <BoldTitle>password if you have created it already:</BoldTitle>
            </Row>
            <Row style={{ position: 'relative' }}>
              <Input
                style={{ position: 'relative' }}
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
              ></Input>
              <Img
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
                style={{
                  position: 'absolute',
                  right: '5rem',
                  top: '4.7rem',
                  cursor: 'pointer',
                }}
                width={'2rem'}
                height={'2rem'}
              >
                <img width="100%" height="100%" src={Eye} />
              </Img>
            </Row>
            <Row>
              <VioletButton
                onClick={() => {
                  setCurrentStep('2');
                }}
                background={'#406EDC'}
              >
                Continue
              </VioletButton>
            </Row>
          </Card>
        ) : currentStep === '2' && !isSpeedPhase ? (
          <Card>
            <Row>
              <BoldTitle>
                Create a new wallet to hold Solana and SPL token
              </BoldTitle>
            </Row>
            <Row>
              <ColorText background={'rgba(164, 231, 151, 0.5)'}>
                Please write down the following seed phrase and keep it in a
                safe place:
              </ColorText>
            </Row>
            <Row>
              <Textarea
                height={'8rem'}
                placeholder={
                  'spacer namer juice cozek captek shlohmo vibes lou parrot very gromko scream'
                }
              ></Textarea>
              <ContainerForIcon>
                <Img width="auto" height="auto">
                  <img src={Copy} />
                </Img>
              </ContainerForIcon>
            </Row>
            <Row>
              <ColorText
                height={'10rem'}
                background={'rgba(242, 154, 54, 0.5)'}
              >
                <img src={Attention} />
                <Title width={'70%'} textAlign={'inherit'}>
                  Your private keys are only stored on your current device. You
                  will need these words to restore your wallet if your browser’s
                  storage is cleared or your device is damaged or lost.
                </Title>
              </ColorText>
            </Row>
            <Row width={'90%'}>
              <Row width={'50%'}>
                <input type="checkbox"></input>
                <Title fontSize={'1.1rem'}>
                  I have saved these words in a safe place.
                </Title>
              </Row>
              <VioletButton
                onClick={() => {
                  setSpeedPhaseOn(true);
                }}
                background={'#406EDC'}
              >
                Go to confirm seed phrase
              </VioletButton>
            </Row>
          </Card>
        ) : currentStep === '2' && isSpeedPhase ? (
          <Card justify={'space-around'}>
            <Row height={'auto'}>
              <BoldTitle>Confirm the seed phrase</BoldTitle>
            </Row>
            <Row height={'auto'}>
              <ColorText
                background={'rgba(164, 231, 151, 0.5)'}
                height={'6rem'}
              >
                <Title width={'75%'}>
                  {' '}
                  Please manually enter the 12 seed phrase words you saved in
                  the previous step in the order in which they were presented to
                  you.
                </Title>
              </ColorText>
            </Row>
            <Row height={'auto'}>
              <Textarea
                height={'8rem'}
                placeholder={
                  'Enter your 12 words in the correct order, separated by spaces here'
                }
                padding={'1rem 2rem 1rem 2rem'}
              ></Textarea>
            </Row>
            <Row height={'auto'} width={'90%'} justify={'space-between'}>
              <VioletButton
                onClick={() => {
                  setCurrentStep('3');
                }}
                background={'#222429'}
                border={'0.1rem solid #fff'}
                width={'48%'}
              >
                Create wallet
              </VioletButton>
              <VioletButton
                onClick={() => {
                  setCurrentStep('3');
                }}
                background={'#406EDC'}
                width={'48%'}
              >
                Create wallet
              </VioletButton>
            </Row>
          </Card>
        ) : (
          <Card width={'100rem'}>
            <Row>
              <Row></Row>
              <Row></Row>
            </Row>
          </Card>
        )}
      </Row>
    </Body>
  );
};
