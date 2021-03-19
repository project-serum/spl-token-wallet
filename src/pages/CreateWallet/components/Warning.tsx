import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@material-ui/core';

import {
  Card,
  VioletButton,
  BoldTitle,
  RowContainer,
  WhiteButton,
  Input,
} from '../../commonStyles';

import BottomLink from '../../../components/BottomLink';
import FakeInputs from '../../../components/FakeInputs';
import AttentionComponent from '../../../components/Attention';
import { forgetWallet } from '../../../utils/wallet-seed';

const CreatePassword = ({
  setCurrentStep,
}: {
  setCurrentStep: (currentStep: number) => void;
}) => {
  const [text, setText] = useState('');

  const theme = useTheme();

  const submit = async () => {
    await forgetWallet()
    await setCurrentStep(1);
  }

  const isDisabled = text !== 'CONFIRM';

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter' && !isDisabled) {
      submit();
    }
  };

  return (
    <>
      <FakeInputs />
      <Card justify={'space-evenly'}>
        <RowContainer direction={'column'}>
          <BoldTitle style={{ fontSize: '2.4rem', marginBottom: '1.5rem' }}>
            Warning
          </BoldTitle>
        </RowContainer>
        <RowContainer width="90%">
          <AttentionComponent
            text={
              'Note that this will delete any existing wallet on this device. Please make sure you save the Seed Phrase for current wallet before creating another one.'
            }
            textStyle={{ fontSize: '1.4rem', fontFamily: 'Avenir Next' }}
            iconStyle={{ margin: '0 2rem 0 3rem' }}
            blockHeight={'10rem'}
          />
        </RowContainer>
        <RowContainer width="90%" style={{ position: 'relative' }}>
          <Input
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
            placeholder={
              'Type CONFIRM to forget your current wallet and create new one'
            }
            onKeyDown={handleKeyDown}
          />
        </RowContainer>
        <RowContainer justify="space-between" width="90%">
          <Link style={{ width: 'calc(50% - .5rem)' }} to="/">
            <WhiteButton theme={theme} width={'100%'}>
              Cancel
            </WhiteButton>
          </Link>
          <VioletButton
            width={'calc(50% - .5rem)'}
            theme={theme}
            disabled={isDisabled}
            onClick={() => submit()}
          >
            Confirm
          </VioletButton>
        </RowContainer>
      </Card>
      <BottomLink toText={'Restore Existing Wallet Using Seed Phrase'} />
    </>
  );
};

export default CreatePassword;
