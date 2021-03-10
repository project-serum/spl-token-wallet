import React, { useEffect, useState } from 'react';
import styled from 'styled-components'
import { Redirect } from 'react-router-dom'
import {
  loadMnemonicAndSeed,
} from '../../utils/wallet-seed';
import { useCallAsync } from '../../utils/notifications';
import { BtnCustom } from '../../components/BtnCustom'

import {
  Input,
  Body,
  Card,
  TextButton,
  Row,
  Img,
  Title,
  VioletButton,
} from '../commonStyles';

import Eye from '../../images/Eye.svg';
import Logo from '../../images/logo.svg';

const WelcomeBack = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const callAsync = useCallAsync();

  const submit = () => {
    callAsync(loadMnemonicAndSeed(password, stayLoggedIn), {
      progressMessage: 'Unlocking wallet...',
      successMessage: 'Wallet unlocked',
      onSuccess: () => {},
      onError: () => {},
    });
  }

  return (
    <Body>
    {' '}
    <Img>
      {' '}
      <img src={Logo} width="100%" height="100%" />
    </Img>
    <Card>
      <Row direction={'column'} justify={'space-between'} height={'75%'}>
        <Row direction={'column'} justify={'space-around'} height={'20%'}>
          <Title fontSize={'2rem'} fontFamily={'Avenir Next Demi'}>Welcome back!</Title>
          <Title fontSize={'1.4rem'} fontFamily={'Avenir Next Demi'} margin={'1rem 0'}>
            Unlock your wallet
          </Title>
        </Row>
        <Row
          direction={'column'}
          height={'50%'}
          style={{ position: 'relative' }}
        >
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Create Password"
           />
          <Img
            onClick={() => {
              setShowPassword(!showPassword);
            }}
            style={{
              position: 'absolute',
              right: '5rem',
              top: '5.5rem',
              cursor: 'pointer',
            }}
            width={'2rem'}
            height={'2rem'}
          >
            <img width="100%" height="100%" src={Eye} />
          </Img>
        </Row>
        <Row width={'90%'} height={'20%'} justify={'space-between'}>
          <VioletButton onClick={submit}>Unlock</VioletButton>
        </Row>
      </Row>
    </Card>
  </Body>
    // <Card>
    //   <CardContent>
    //     <Typography variant="h5" gutterBottom>
    //       Unlock Wallet
    //     </Typography>
    //     <TextField
    //       variant="outlined"
    //       fullWidth
    //       margin="normal"
    //       label="Password"
    //       type="password"
    //       autoComplete="current-password"
    //       value={password}
    //       onChange={(e) => setPassword(e.target.value)}
    //     />
    //     <FormControlLabel
    //       control={
    //         <Checkbox
    //           checked={stayLoggedIn}
    //           onChange={(e) => setStayLoggedIn(e.target.checked)}
    //         />
    //       }
    //       label="Keep wallet unlocked"
    //     />
    //   </CardContent>
    //   <CardActions style={{ justifyContent: 'flex-end' }}>
    //     <BtnCustom color="primary" onClick={submit}>
    //       Unlock
    //     </BtnCustom>
    //   </CardActions>
    // </Card>
  );
}

export default WelcomeBack