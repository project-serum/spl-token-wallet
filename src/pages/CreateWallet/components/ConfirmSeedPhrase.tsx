import React, { useState } from 'react';
import { useTheme } from '@material-ui/core';
import {
  Card,
  Row,
  VioletButton,
  BoldTitle,
  RowContainer,
  Textarea,
  ColorText,
  Title,
  WhiteButton,
} from '../../commonStyles';

import BottomLink from '../../../components/BottomLink';
import { sleep } from '../../../utils/utils';

const ConfirmSeedPhrase = ({
  password,
  seedPhrase,
  createWallet,
  setCurrentStep,
  setIsConfirmSeedPhrase,
}: {
  password: string;
  seedPhrase: string;
  createWallet: (password: string, onSuccess: () => void) => void;
  setCurrentStep: (currentStep: number) => void;
  setIsConfirmSeedPhrase: (isConfirmed: boolean) => void;
}) => {
  const [savedSeedPhrase, setSavedSeedPhrase] = useState('');
  const theme = useTheme();

  return (
    <>
      <Card justify={'space-around'}>
        <RowContainer height={'auto'} padding="1rem 0 0 0">
          <BoldTitle>Confirm the seed phrase</BoldTitle>
        </RowContainer>
        <Row width={'90%'}>
          <ColorText background={'rgba(164, 231, 151, 0.5)'} height={'6rem'}>
            <Title width={'100%'}>
              Please manually enter the 12 or 24 seed phrase words you saved in
              the previous step in the order in which they were presented to
              you.
            </Title>
          </ColorText>
        </Row>
        <Row width={'90%'}>
          <Textarea
            height={'11.2rem'}
            value={savedSeedPhrase}
            onChange={(e) => setSavedSeedPhrase(e.target.value)}
            placeholder={
              'Enter your 12 or 24 words in the correct order, separated by spaces here'
            }
            padding={'1rem 2rem 1rem 2rem'}
          />
        </Row>
        <Row width={'90%'} justify={'space-between'}>
          <WhiteButton
            theme={theme}
            width={'calc(50% - .5rem)'}
            onClick={() => {
              setIsConfirmSeedPhrase(false);
            }}
          >
            Back
          </WhiteButton>
          <VioletButton
            theme={theme}
            width={'calc(50% - .5rem)'}
            disabled={seedPhrase !== savedSeedPhrase}
            onClick={async () => {
              await createWallet(password, async () => {
                await sleep(1000);
                await setCurrentStep(3);
              });
            }}
          >
            Create wallet
          </VioletButton>
        </Row>
      </Card>
      <BottomLink />
    </>
  );
};

export default ConfirmSeedPhrase;
