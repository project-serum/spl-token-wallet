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
  Legend,
  RowContainer,
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
      <RowContainer direction={'column'}>
        <Img margin={'0'} height={'10rem'}>
          {' '}
          <img src={Logo} width="100%" height="100%" />
        </Img>
        <RowContainer
          direction={'row'}
          justify={'flex-start'}
          align={'baseline'}
          height={'15%'}
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
        </RowContainer>
        {currentStep === '1' ? (
          <Card>
            <RowContainer direction={'column'}>
              <BoldTitle style={{ marginBottom: '1.5rem' }}>
                Create a password or type your addressbook
              </BoldTitle>
              <BoldTitle>password if you have created it already:</BoldTitle>
            </RowContainer>
            <RowContainer style={{ position: 'relative' }}>
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
            </RowContainer>
            <RowContainer>
              <VioletButton
                onClick={() => {
                  setCurrentStep('2');
                }}
                background={'#406EDC'}
              >
                Continue
              </VioletButton>
            </RowContainer>
          </Card>
        ) : currentStep === '2' && !isSpeedPhase ? (
          <Card>
            <RowContainer>
              <BoldTitle>
                Create a new wallet to hold Solana and SPL token
              </BoldTitle>
            </RowContainer>
            <RowContainer>
              <ColorText background={'rgba(164, 231, 151, 0.5)'}>
                Please write down the following seed phrase and keep it in a
                safe place:
              </ColorText>
            </RowContainer>
            <RowContainer>
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
            </RowContainer>
            <RowContainer>
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
            </RowContainer>
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
            <RowContainer height={'auto'}>
              <BoldTitle>Confirm the seed phrase</BoldTitle>
            </RowContainer>
            <RowContainer height={'auto'}>
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
            </RowContainer>
            <RowContainer height={'auto'}>
              <Textarea
                height={'8rem'}
                placeholder={
                  'Enter your 12 words in the correct order, separated by spaces here'
                }
                padding={'1rem 2rem 1rem 2rem'}
              ></Textarea>
            </RowContainer>
            <RowContainer
              height={'auto'}
              width={'90%'}
              justify={'space-between'}
            >
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
            </RowContainer>
          </Card>
        ) : (
          <Card width={'100rem'}>
            <RowContainer>
              {' '}
              <RowContainer
                style={{ borderRight: '0.2rem solid #383B45' }}
                height={'96%'}
                direction={'column'}
              >
                <Row width={'85%'} justify={'end'}>
                  <BoldTitle color={'#96999C'} style={{ marginRight: '1rem' }}>
                    Step 1:
                  </BoldTitle>
                  <BoldTitle>
                    Deposit some SOL to activate your wallet.
                  </BoldTitle>
                </Row>
                <Row justify={'end'} width={'85%'}>
                  <BoldTitle style={{ width: '25%' }} fontSize={'1.3rem'}>
                    Your SOL address
                  </BoldTitle>
                  <Legend />
                </Row>
                <Row width={'85%'}>
                  {' '}
                  <Input height={'4rem'} width={'100%'} type="text"></Input>
                  <ContainerForIcon right={'1.5rem'} top={'1.1rem'}>
                    <Img width="auto" height="auto">
                      <img src={Copy} />
                    </Img>
                  </ContainerForIcon>
                </Row>
                <Row width={'85%'}>
                  <ColorText
                    width={'100%'}
                    height={'12rem'}
                    background={'rgba(242, 154, 54, 0.5)'}
                  >
                    <img src={Attention} />
                    <span
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '87%',
                        justifyContent: 'space-around',
                        height: '90%',
                      }}
                    >
                      <Title textAlign={'inherit'}>
                        Transaction in Solana Network usually takes no more than
                        a second, but if you send SOL from an exchange, the
                        withdrawal can be delayed for few minutes.
                      </Title>
                      <Title textAlign={'inherit'}>
                        Click the “Refresh Balance” button after exchange
                        confirms your withdrawal to update your balance and
                        continue setting up your wallet.
                      </Title>
                    </span>
                  </ColorText>
                </Row>
                <RowContainer>
                  <VioletButton width={'30%'} background={'#366CE5'}>
                    Refresh Balance
                  </VioletButton>
                  <span>
                    <BoldTitle>Your Balance: </BoldTitle>
                    <BoldTitle color={'#A5E898'}>1.000 SOL</BoldTitle>
                  </span>
                </RowContainer>
              </RowContainer>
              <RowContainer></RowContainer>
            </RowContainer>
          </Card>
        )}
      </RowContainer>
    </Body>
  );
};
