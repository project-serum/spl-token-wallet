import React, { useState } from 'react';
import { useTheme } from '@material-ui/core';

import {
  Card,
  Row,
  VioletButton,
  BoldTitle,
  RowContainer,
} from '../../commonStyles';

import { InputWithEye } from '../../../components/Input';

import BottomLink from '../../../components/BottomLink';

const CreatePassword = ({
  password,
  setPassword,
  setCurrentStep,
}: {
  password: string;
  setPassword: (password: string) => void;
  setCurrentStep: (currentStep: number) => void;
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const theme = useTheme()

  return (
    <>
      <Card justify={'space-evenly'}>
        <RowContainer direction={'column'}>
          <BoldTitle style={{ marginBottom: '1.5rem' }}>
            Create a password or type your addressbook
          </BoldTitle>
          <BoldTitle>password if you have created it already:</BoldTitle>
        </RowContainer>
        <Row width={'90%'} style={{ position: 'relative' }}>
          <InputWithEye
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder={'Password'}
            showPassword={showPassword}
            onEyeClick={() => setShowPassword(!showPassword)}
          />
        </Row>
        <RowContainer>
          <VioletButton
            theme={theme}
            disabled={password === ''}
            onClick={() => {
              setCurrentStep(2);
            }}
          >
            Continue
          </VioletButton>
        </RowContainer>
      </Card>
      <BottomLink />
    </>
  );
};

export default CreatePassword;
