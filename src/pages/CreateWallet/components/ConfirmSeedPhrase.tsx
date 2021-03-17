import React, { useState } from 'react';
import { useTheme } from '@material-ui/core';
import {
  Card,
  Row,
  VioletButton,
  BoldTitle,
  RowContainer,
  ColorText,
  Title,
  WhiteButton,
  Input,
} from '../../commonStyles';

import BottomLink from '../../../components/BottomLink';
import { sleep } from '../../../utils/utils';

const ConfirmSeedPhrase = ({
  password,
  seedPhrase,
  createWallet,
  setCurrentStep,
  setIsConfirmSeedPhrase,
  randomNumbersOfSeedWords,
}: {
  password: string;
  seedPhrase: string;
  createWallet: (password: string, onSuccess: () => void) => void;
  setCurrentStep: (currentStep: number) => void;
  setIsConfirmSeedPhrase: (isConfirmed: boolean) => void;
  randomNumbersOfSeedWords: number[]
}) => {
  const theme = useTheme();

  const [firstWord, setFirstWord] = useState('');
  const [secondWord, setSecondWord] = useState('');
  const [thirdWord, setThirdWord] = useState('');
  const [fourthWord, setFourthWord] = useState('');

  const seedPhraseArray = seedPhrase.split(' ');

  const submit = async () => {
    await createWallet(password, async () => {
      await sleep(1000);
      await setCurrentStep(3);
    });
  }

  const isDisabled =
    firstWord !== seedPhraseArray[randomNumbersOfSeedWords[0] - 1] ||
    secondWord !== seedPhraseArray[randomNumbersOfSeedWords[1] - 1] ||
    thirdWord !== seedPhraseArray[randomNumbersOfSeedWords[2] - 1] ||
    fourthWord !== seedPhraseArray[randomNumbersOfSeedWords[3] - 1];

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter' && !isDisabled) {
      submit();
    }
  };

  return (
    <>
      <Card justify={'space-around'}>
        <RowContainer height={'auto'} padding="1rem 0 0 0">
          <BoldTitle>Confirm the seed phrase</BoldTitle>
        </RowContainer>
        <Row width={'90%'}>
          <ColorText background={'rgba(164, 231, 151, 0.5)'} height={'6rem'}>
            <Title width={'100%'}>
              Please manually enter 4 words you saved in the previous step.
            </Title>
          </ColorText>
        </Row>
        <Row width={'90%'} direction={'column'}>
          <RowContainer justify="space-between">
            <Input
              width="calc(50% - .5rem)"
              value={firstWord}
              onChange={(e) => setFirstWord(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`${randomNumbersOfSeedWords[0]}#:`}
            />
            <Input
              width="calc(50% - .5rem)"
              value={secondWord}
              onChange={(e) => setSecondWord(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`${randomNumbersOfSeedWords[1]}#:`}
            />
          </RowContainer>
          <RowContainer margin="1rem 0 0 0" justify="space-between">
            <Input
              width="calc(50% - .5rem)"
              value={thirdWord}
              onChange={(e) => setThirdWord(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`${randomNumbersOfSeedWords[2]}#:`}
            />
            <Input
              width="calc(50% - .5rem)"
              value={fourthWord}
              onChange={(e) => setFourthWord(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`${randomNumbersOfSeedWords[3]}#:`}
            />
          </RowContainer>
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
            disabled={isDisabled}
            width={'calc(50% - .5rem)'}
            onClick={() => submit()}
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
