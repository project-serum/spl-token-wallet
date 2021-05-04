import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Body, RowContainer } from '../commonStyles';

import Logo from '../../components/Logo';

import ProgressBar from './components/ProgressBar';
import CreatePassword from './components/CreatePassword';
import SaveSeedPhrase from './components/SaveSeedPhrase';
import ConfirmSeedPhrase from './components/ConfirmSeedPhrase';
import AddTokens from './components/AddTokens';
import Warning from './components/Warning';
import {
  generateMnemonicAndSeed,
  useHasLockedMnemonicAndSeed,
  storeMnemonicAndSeed,
} from '../../utils/wallet-seed';
import { useCallAsync } from '../../utils/notifications';
import { DERIVATION_PATH } from '../../utils/walletProvider/localStorage';
import FakeInputs from '../../components/FakeInputs';

const MainRow = styled(RowContainer)`
  @media (max-width: 400px) {
    padding-bottom: 3rem;
    overflow-x: auto;
    height: 80%;
  }
`;

export const CreateWalletPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [password, setPassword] = useState('');
  const [isConfirmSeedPhrase, setIsConfirmSeedPhrase] = useState(false);

  const [mnemonicAndSeed, setMnemonicAndSeed] = useState<{
    mnemonic: string;
    seed: string;
  }>({ mnemonic: '', seed: '' });

  const [hasLockedMnemonicAndSeed] = useHasLockedMnemonicAndSeed();

  useEffect(() => {
    if (hasLockedMnemonicAndSeed) {
      setCurrentStep(0);
    }

    generateMnemonicAndSeed().then((seedAndMnemonic) => {
      setMnemonicAndSeed(seedAndMnemonic);
    });
  }, [hasLockedMnemonicAndSeed]);

  const callAsync = useCallAsync();

  const submit = async (password, onSuccess) => {
    const { mnemonic, seed } = mnemonicAndSeed;
    await callAsync(
      storeMnemonicAndSeed(
        mnemonic,
        seed,
        password,
        DERIVATION_PATH.bip44Change,
      ),
      {
        progressMessage: 'Creating wallet...',
        successMessage: 'Wallet created',
        onError: () => {},
        onSuccess,
      },
    );
  };

  return (
    <Body>
      <FakeInputs />
      <RowContainer height={'100%'} direction={'column'}>
        <Logo />
        <MainRow direction={'column'}>
          {/* margin={currentStep !== 0 ? '0 0 3rem 0' : '0 0 8rem 0'} */}
          {currentStep !== 0 && <ProgressBar currentStep={currentStep} />}

          {currentStep === 0 ? (
            <Warning onSubmit={() => setCurrentStep(1)} />
          ) : currentStep === 1 ? (
            <CreatePassword
              password={password}
              setPassword={setPassword}
              setCurrentStep={setCurrentStep}
            />
          ) : currentStep === 2 && !isConfirmSeedPhrase ? (
            <SaveSeedPhrase
              seedPhrase={mnemonicAndSeed.mnemonic}
              setIsConfirmSeedPhrase={setIsConfirmSeedPhrase}
            />
          ) : currentStep === 2 && isConfirmSeedPhrase ? (
            <ConfirmSeedPhrase
              password={password}
              seedPhrase={mnemonicAndSeed.mnemonic
                .split(' ')
                .slice(0, 12)
                .join(' ')}
              setCurrentStep={setCurrentStep}
              setIsConfirmSeedPhrase={setIsConfirmSeedPhrase}
              createWallet={submit}
            />
          ) : (
            <AddTokens />
          )}
        </MainRow>
      </RowContainer>
    </Body>
  );
};
