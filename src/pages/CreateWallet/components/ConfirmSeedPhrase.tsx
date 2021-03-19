import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
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
  // Input,
} from '../../commonStyles';

import BottomLink from '../../../components/BottomLink';
import { sleep } from '../../../utils/utils';
import FakeInputs from '../../../components/FakeInputs';
import { BtnCustom } from '../../../components/BtnCustom';

const SmallButton = styled(({ theme, isSelected, ...props }) => (
  <BtnCustom
    theme={theme}
    btnColor={
      isSelected
        ? theme.customPalette.white.main
        : theme.customPalette.grey.dark
    }
    borderColor={
      isSelected
        ? theme.customPalette.blue.serum
        : theme.customPalette.grey.dark
    }
    btnWidth="auto"
    fontSize={'1.4rem'}
    textTransform="lowercase"
    padding="0 1rem"
    margin={'0 1rem 1rem 0'}
    borderRadius="2rem"
    border={theme.customPalette.border.new}
    {...props}
  />
))``;

function shuffleArray(array): any[] {
  let result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

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
  const theme = useTheme();

  const [savedSeedWords, setSavedSeedWords] = useState<string[]>([]);
  const [randomlyPlacedSeedWords, updateRandomlyPlacedSeedWords] = useState<
    string[]
  >([]);

  useEffect(() => {
    const seedPhraseArray = seedPhrase.split(' ');

    setSavedSeedWords([])
    updateRandomlyPlacedSeedWords(shuffleArray(seedPhraseArray));
  }, [seedPhrase]);

  const submit = async () => {
    await createWallet(password, async () => {
      await sleep(1000);
      await setCurrentStep(3);
    });
  };

  const isDisabled = savedSeedWords.join(' ') !== seedPhrase;

  return (
    <>
      <FakeInputs />
      <Card height="55rem" width="55rem" justify={'space-around'}>
        <RowContainer height={'auto'} padding="1rem 0 0 0">
          <BoldTitle>Confirm the seed phrase</BoldTitle>
        </RowContainer>
        <Row width={'90%'}>
          <ColorText background={'rgba(164, 231, 151, 0.5)'} height={'6rem'}>
            <Title width={'100%'} fontFamily={'Avenir Next Demi'}>
              Place the words from your Seed Phrase in the correct order by
              clicking on the words.
            </Title>
          </ColorText>
        </Row>
        <Row width={'90%'} margin="2rem 0 0 0">
          <RowContainer
            wrap="wrap"
            style={{
              border: theme.customPalette.border.new,
              padding: '1rem 1rem 0 1rem',
              borderRadius: '2rem',
              minHeight: '9rem',
            }}
          >
            {savedSeedWords.map((word) => (
              <SmallButton
                isSelected
                theme={theme}
                onClick={() => {
                  const newSavedSeedWords = savedSeedWords.filter(
                    (w, i) => !(w === word && savedSeedWords.indexOf(word) === i),
                  );
                  const newRandomlySavedWords = [
                    ...randomlyPlacedSeedWords,
                    word,
                  ];

                  setSavedSeedWords(newSavedSeedWords);
                  updateRandomlyPlacedSeedWords(newRandomlySavedWords);
                }}
              >
                {word}
              </SmallButton>
            ))}
          </RowContainer>
        </Row>
        {randomlyPlacedSeedWords.length > 0 && (
          <Row width={'90%'} margin="2rem 0 0 0">
            <RowContainer wrap="wrap">
              {randomlyPlacedSeedWords.map((word) => (
                <SmallButton
                  theme={theme}
                  onClick={() => {
                    const newRandomlySavedWords = randomlyPlacedSeedWords.filter(
                      (w, i) => !(w === word && randomlyPlacedSeedWords.indexOf(word) === i),
                    );
                    const newSavedSeedWords = [...savedSeedWords, word];

                    setSavedSeedWords(newSavedSeedWords);
                    updateRandomlyPlacedSeedWords(newRandomlySavedWords);
                  }}
                >
                  {word}
                </SmallButton>
              ))}
            </RowContainer>
          </Row>
        )}
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
