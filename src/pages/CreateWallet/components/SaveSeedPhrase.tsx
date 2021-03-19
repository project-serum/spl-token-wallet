import React, { useState } from 'react';
import { useTheme } from '@material-ui/core';

import {
  Card,
  Row,
  VioletButton,
  BoldTitle,
  RowContainer,
  ColorText,
  StyledCheckbox,
  StyledLabel,
} from '../../commonStyles';

import { TextareaWithCopy } from '../../../components/Input';
import BottomLink from '../../../components/BottomLink';
import AttentionComponent from '../../../components/Attention';
import clipboardCopy from 'clipboard-copy';
import FakeInputs from '../../../components/FakeInputs';

const CreatePassword = ({
  seedPhrase,
  setIsConfirmSeedPhrase,
}: {
  seedPhrase: string;
  setIsConfirmSeedPhrase: (isConfirm: boolean) => void;
}) => {
  const [savedSeedPhrase, setSavedSeedPhrase] = useState(false);
  const theme = useTheme();

  const submit = () => {
    setIsConfirmSeedPhrase(true);
  };

  const isDisabled = !savedSeedPhrase;

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter' && !isDisabled) {
      submit();
    }
  };

  return (
    <>
      <FakeInputs />
      <Card width="53rem" height="55rem">
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
            <ColorText
              style={{ fontSize: '1.3rem', fontFamily: 'Avenir Next Demi' }}
              background={'rgba(164, 231, 151, 0.5)'}
            >
              Please write down the following seed phrase and keep it in a safe
              place:
            </ColorText>
          </RowContainer>
          <RowContainer style={{ position: 'relative' }}>
            <TextareaWithCopy
              height={'11.2rem'}
              value={seedPhrase}
              style={{ fontSize: '1.3rem', overflowY: 'auto' }}
              onCopy={() => clipboardCopy(seedPhrase)}
            />
          </RowContainer>
          <AttentionComponent
            text={
              'Your private keys are only stored on your current device. You will need these words to restore your wallet if your browser’s storage is cleared or your device is damaged or lost.'
            }
            textStyle={{ fontSize: '1.4rem', paddingRight: '1rem' }}
            iconStyle={{ margin: '0 3rem 0 3rem', height: '60%' }}
          />
          <RowContainer>
            <Row width={'50%'}>
              <StyledCheckbox
                value={savedSeedPhrase}
                onChange={() => setSavedSeedPhrase(!savedSeedPhrase)}
                id="savedSeedPhrase"
                theme={theme}
                onKeyDown={handleKeyDown}
              />
              <StyledLabel htmlFor="savedSeedPhrase" fontSize={'1.4rem'} style={{ paddingRight: '2rem' }}>
                I have saved these words in a safe place.
              </StyledLabel>
            </Row>
            <VioletButton
              theme={theme}
              disabled={isDisabled}
              onClick={() => submit()}
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
