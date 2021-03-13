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
  StyledCheckbox,
  StyledLabel,
} from '../../commonStyles';

import { TextareaWithCopy } from '../../../components/Input';
import BottomLink from '../../../components/BottomLink';

import Attention from '../../../images/attention.svg';

const CreatePassword = ({
  seedPhrase,
  setIsConfirmSeedPhrase,
}: {
  seedPhrase: string;
  setIsConfirmSeedPhrase: (isConfirm: boolean) => void;
}) => {
  const [savedSeedPhrase, setSavedSeedPhrase] = useState(false);
  const theme = useTheme();

  return (
    <>
      <Card>
        <Row
          width={'90%'}
          height={'100%'}
          direction={'column'}
          justify={'space-evenly'}
        >
          <RowContainer>
            <BoldTitle>
              Create a new wallet to hold Solana and SPL token
            </BoldTitle>
          </RowContainer>
          <RowContainer>
            <ColorText background={'rgba(164, 231, 151, 0.5)'}>
              Please write down the following seed phrase and keep it in a safe
              place:
            </ColorText>
          </RowContainer>
          <RowContainer style={{ position: 'relative' }}>
            <TextareaWithCopy
              height={'8rem'}
              value={seedPhrase}
            />
          </RowContainer>
          <RowContainer>
            <ColorText height={'10rem'} background={'rgba(242, 154, 54, 0.5)'}>
              <img alt="Attention" src={Attention} />
              <Title width={'70%'} textAlign={'inherit'}>
                Your private keys are only stored on your current device. You
                will need these words to restore your wallet if your browser’s
                storage is cleared or your device is damaged or lost.
              </Title>
            </ColorText>
          </RowContainer>
          <RowContainer>
            <Row width={'50%'}>
              <StyledCheckbox
                value={savedSeedPhrase}
                onChange={() => setSavedSeedPhrase(!savedSeedPhrase)}
                id="savedSeedPhrase"
                theme={theme}
              />
              <StyledLabel
                htmlFor="savedSeedPhrase"
                style={{ whiteSpace: 'nowrap' }}
                fontSize={'0.9rem'}
              >
                I have saved these words in a safe place.
              </StyledLabel>
            </Row>
            <VioletButton
              theme={theme}
              disabled={!savedSeedPhrase}
              onClick={() => {
                setIsConfirmSeedPhrase(true);
              }}
            >
              Go to confirm seed phrase
            </VioletButton>
          </RowContainer>
        </Row>
      </Card>
      <BottomLink />
    </>
  );
};

export default CreatePassword;
