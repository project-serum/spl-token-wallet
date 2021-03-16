import React, { useState, useEffect } from 'react';
import { Body, RowContainer } from '../commonStyles';

import Logo from '../../components/Logo';

import ProgressBar from './components/ProgressBar';
import CreatePassword from './components/CreatePassword';
import SaveSeedPhrase from './components/SaveSeedPhrase';
import ConfirmSeedPhrase from './components/ConfirmSeedPhrase';
import AddTokens from './components/AddTokens';
import {
  generateMnemonicAndSeed,
  storeMnemonicAndSeed,
} from '../../utils/wallet-seed';
import { useCallAsync } from '../../utils/notifications';
import { DERIVATION_PATH } from '../../utils/walletProvider/localStorage';
import FakeInputs from '../../components/FakeInputs';

export const CreateWalletPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [password, setPassword] = useState('');
  const [isConfirmSeedPhrase, setIsConfirmSeedPhrase] = useState(false);
  const [mnemonicAndSeed, setMnemonicAndSeed] = useState<{
    mnemonic: string;
    seed: string;
  }>({ mnemonic: '', seed: '' });

  useEffect(() => {
    generateMnemonicAndSeed().then(setMnemonicAndSeed);
  }, []);

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
      <RowContainer direction={'column'}>
        <Logo margin={'0 0 3rem 0'} />
        <ProgressBar currentStep={currentStep} />
        {currentStep === 1 ? (
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
            seedPhrase={mnemonicAndSeed.mnemonic}
            setCurrentStep={setCurrentStep}
            setIsConfirmSeedPhrase={setIsConfirmSeedPhrase}
            createWallet={submit}
          />
        ) : (
          <AddTokens />
        )}
      </RowContainer>
    </Body>
  );
};
