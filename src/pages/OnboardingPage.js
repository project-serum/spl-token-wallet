import React, { useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import {
  useHasLockedMnemonicAndSeed,
} from '../utils/wallet-seed';
import { DialogActions, Button, Card, Typography, CardMedia, Box, MobileStepper } from '@material-ui/core';
import WelcomePage from './WelcomePage';
import NftPage from './NftPage';

const styles = ({
  welcomeCard: {
    width : '80%',
    margin: '40px auto',    
  },
  textContainer: {
    backgroundColor: '#222',
    borderRadius: '20px 20px 0 0',

  },
  button: {
    fontSize: "19px",
    fontWeight: "600",
    padding: "5px 20px",
    lineHeight: "24px",
    textTransform: "unset",    
  },
  text: {
    height:'120px',
    display: 'flex',
    alignItems: 'center', 
    justifyContent: 'center',
    flexDirection: 'column',   
  },
  buttonSkip: {
    fontSize: "19px",
    fontWeight: "600",    
    lineHeight: "24px",
    textTransform: "unset",   
    color: "#347AF0"
  },
  buttonStack: {
    width: '100%',
    maxWidth: '300px',
    margin: 'auto'
  },
  stepper: {
    backgroundColor: 'unset',
    maxWidth: 300,
    justifyContent: 'center'
  }
})

export default function OnboardingPage() {
  const [hasLockedMnemonicAndSeed, loading] = useHasLockedMnemonicAndSeed();

  
  const [step, setStep] = useState(0);
  const [skip, setSkip] = useState(false);
  const [nft, setNft] = useState(false);

  const text = [
    {
      title : "Welcome to Salmon",
      paragraph: "The Solana OpenSource Wallet"
    },
    {
      title : "Non-custodial",
      paragraph: "Salmon doesn't store any data about the wallet. Everything you see is in your browser or your mobile app at a local level. There are no email addresses associated with accounts."
    },
    {
      title : "Seed phrase",
      paragraph: "It’s VERY IMPORTANT to keep the seed-phrase you’re about to see in a safe place. Loosing it may prevent you from accesing your funds."
    }
  ]

  if(nft){
    return (
      <NftPage/>
    )
  }

  if(hasLockedMnemonicAndSeed)
    return (<WelcomePage/>)

  if(step >= 3){
    return (
      <WelcomePage/>
    )
  }

  if(skip){
    return (
      <WelcomePage/>
    )
  }

  if(step < 3){
    return (
      <Container maxWidth="xs">
        <Card>
          <Box px={2} py={6}>
            <Box align="right" py={1}>
              <Button style={styles.buttonSkip} align="right" variant="text" color="primary" px={5} onClick={() => setSkip(true)}>
                Skip
              </Button>
            </Box>
            <CardMedia style={styles.welcomeCard} image="images/logo.png" component="img"/>      
          </Box>
          <Box style={styles.textContainer} align="center" px={2} py={2}>
            

          <MobileStepper
            variant="dots"
            steps={3}
            position="static"
            activeStep={step}
            style={styles.stepper}            
          />


            <Box py={3} px={5}>    
              <Typography variant="h1">{text[step].title}</Typography>
            </Box>
            <Box pb={2} px={4} style={styles.text}>    
              <Typography align='center' variant="paragraph">{text[step].paragraph}</Typography>
            </Box>
          
            <Box align="center" p={4}>
              <Button style={styles.button} variant="outlined" color="primary" px={5} onClick={() => setStep(step+1)}>
                Next
              </Button>
            </Box>
          </Box>
        </Card>
      </Container>
    );
  }

}