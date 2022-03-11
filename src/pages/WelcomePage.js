import React, { useEffect, useState } from 'react';
import {
  generateMnemonicAndSeed,
  useHasLockedMnemonicAndSeed,
  loadMnemonicAndSeed,
  mnemonicToSeed,
  storeMnemonicAndSeed,
  normalizeMnemonic,
} from '../utils/wallet-seed';
import {
  getAccountFromSeed,
  DERIVATION_PATH,
} from '../utils/walletProvider/localStorage.js';
import Container from '@material-ui/core/Container';
import LoadingIndicator from '../components/LoadingIndicator';
import { BalanceListItem } from '../components/BalancesList.js';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { DialogActions, DialogContentText, DialogTitle, Typography, CardMedia, CardHeader, Box } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { useCallAsync } from '../utils/notifications';
import Link from '@material-ui/core/Link';
import { validateMnemonic } from 'bip39';
import DialogForm from '../components/DialogForm';
import './login-page.css';


const styles = ({
  welcomeCard: {
    width : '80%',
    margin: '40px auto',    
  },
  button: {
    fontSize: '19px',
    fontWeight: 600,
    textTransform: 'unset',
    lineHeight: '24px',
    padding: '11px 13.5px',
    margin: '10px',
  },
  buttonStack: {
    width: '100%',
    maxWidth: '300px',
    margin: 'auto'
  },
  welcomeFirst: {
    color: '#979797',
    fontWeight: '300',
    fontSize: '28px',
    lineHieght: '54px'
  },
  welcomeSecond: {
    color: '#FF855F',
    fontWeight: '300',
    fontSize: '48px',
    lineHieght: '54px'
  }
})

export default function WelcomePage() {
  const [restore, setRestore] = useState(false);
  const [hasLockedMnemonicAndSeed, loading] = useHasLockedMnemonicAndSeed();

  if (loading) {
    return null;
  }

  return (
    <Container maxWidth="xs">
      {restore ? (
        <RestoreWalletForm goBack={() => setRestore(false)} />
      ) : (
        <>
          {hasLockedMnemonicAndSeed ? <LoginForm /> : <WelcomeForm />}
        </>
      )}
    </Container>
  );
}

function WelcomeForm() {
  const [createWallet, setCreateWallet] = useState(false);
  const [restoreWallet, setRestoreWallet] = useState(false);

  if(createWallet)
    return <CreateWalletMessagges/>

  if(restoreWallet)
    return <RestoreWalletForm/>

  if(!createWallet)
    return (
      <Card>
        <Box px={8} py={14}>        
          <Box px={4} py={1}>
            <CardMedia style={styles.welcomeCard} image="images/logo.png" component="img"/>      
          </Box>
          <Box mb={8}>
            <Typography style={styles.welcomeFirst} align="center" variant="h1" gutterBottom>
              Welcome to
            </Typography>          
            <Typography style={styles.welcomeSecond} align="center" variant="h1" gutterBottom>
              SALMON
            </Typography>
          </Box>          
          <Box style={styles.buttonStack} display="flex" flexDirection="column">
            <Button variant="contained" style={styles.button} color="primary" onClick={() => setCreateWallet(true)}>
                Create Wallet
              </Button>
            <Button variant="contained" style={styles.button} color="secondary" onClick={() => setRestoreWallet(true)}>
                Recover Wallet
            </Button>
          </Box>
        </Box>
      </Card>  
    );
}

function CreateWalletMessagges() {
  const [createWallet, setCreateWallet] = useState(false);

  if(createWallet)
    return <CreateWalletForm/>

  return (
    <Card>
      <Box p={8}>         
        <CardMedia style={styles.welcomeCard} image="images/logo.png" component="img"/>      
        <Box m={3}> 
          <Typography align="center" variant="h1">Keep your seed safe!</Typography>
        </Box>
        <Box m={2}> 
          <Typography align="center" variant="paragraph">
                Your private keys are only stored on your current computer or device.
                You will need these words to restore your wallet if your browser's
                storage is cleared or your device is damaged or lost.          
          </Typography>
        </Box>
        <Box style={styles.buttonStack} display="flex" flexDirection="column">
          <Button variant="contained" style={styles.button} color="primary" onClick={() => setCreateWallet(true)}>
              Continue
            </Button>
          
        </Box>
      </Box>
    </Card>
  )
}


function CreateWalletForm() {
  const [mnemonicAndSeed, setMnemonicAndSeed] = useState(null);
  useEffect(() => {
    generateMnemonicAndSeed().then(setMnemonicAndSeed);
  }, []);
  const [savedWords, setSavedWords] = useState(false);
  const callAsync = useCallAsync();

  function submit(password) {
    const { mnemonic, seed } = mnemonicAndSeed;
    callAsync(
      storeMnemonicAndSeed(
        mnemonic,
        seed,
        password,
        DERIVATION_PATH.bip44Change,
      ),
      {
        progressMessage: 'Creating wallet...',
        successMessage: 'Wallet created',
      },
    );
  }

  if (!savedWords) {
    return (
      <SeedWordsForm
        mnemonicAndSeed={mnemonicAndSeed}
        goForward={() => setSavedWords(true)}
      />
    );
  }

  return (
    <ChoosePasswordForm
      mnemonicAndSeed={mnemonicAndSeed}
      goBack={() => setSavedWords(false)}
      onSubmit={submit}
    />
  );
}

function SeedWordsForm({ mnemonicAndSeed, goForward }) {
  const [confirmed, setConfirmed] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [seedCheck, setSeedCheck] = useState('');

  const downloadMnemonic = (mnemonic) => {
    const url = window.URL.createObjectURL(new Blob([mnemonic]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sollet.bak');
    document.body.appendChild(link);
    link.click();
  }

  return (
    <>    
      <Card>
        <Box p={4}>
        <CardMedia style={styles.welcomeCard} image="images/logo.png" component="img"/>
          <Typography align="center" variant="h1" gutterBottom>
            Create New Wallet
          </Typography>        
          <Typography>
            Please write down the following twenty four words and keep them in a
            safe place:
          </Typography>
          {mnemonicAndSeed ? (
            <TextField
              variant="outlined"
              fullWidth
              multiline
              margin="normal"
              value={mnemonicAndSeed.mnemonic}
              label="Seed Words"
              onFocus={(e) => e.currentTarget.select()}
            />
          ) : (
            <LoadingIndicator />
          )}
          <FormControlLabel
            control={
              <Checkbox
                checked={confirmed}
                disabled={!mnemonicAndSeed}
                onChange={(e) => setConfirmed(e.target.checked)}
              />
            }
            label="I have saved these words in a safe place."
          />
          
          <Box mt={4} align="center">
            <Button variant="contained" color="primary" style={styles.button} onClick={() => {
              downloadMnemonic(mnemonicAndSeed?.mnemonic);
              setDownloaded(true);
            }}>
              Download File (Required)
            </Button>
          </Box>
          
        </Box>
        <CardActions style={{ justifyContent: 'flex-end' }}>
          <Button color="primary" disabled={!confirmed || !downloaded} onClick={() => setShowDialog(true)}>
            Continue
          </Button>
        </CardActions>
      </Card>
      <DialogForm
        open={showDialog}
        onClose={() => setShowDialog(false)}
        onSubmit={goForward}
        fullWidth
      >
        <DialogTitle>{'Confirm Mnemonic'}</DialogTitle>
        <DialogContentText style={{ margin: 20 }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            Please re-enter your seed phrase to confirm that you have saved it.
          </div>
          <TextField
            label={`Please type your seed phrase to confirm`}
            fullWidth
            variant="outlined"
            margin="normal"
            value={seedCheck}
            onChange={(e) => setSeedCheck(e.target.value)}
          />
        </DialogContentText>
        <DialogActions>
          <Button variant="outlined" color="secondary" onClick={() => setShowDialog(false)}>Close</Button>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            disabled={normalizeMnemonic(seedCheck) !== mnemonicAndSeed?.mnemonic}
          >
            Continue
          </Button>
        </DialogActions>
      </DialogForm>
    </>
  );
}

function ChoosePasswordForm({ goBack, onSubmit }) {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Choose a Password (Optional)
        </Typography>
        <Typography>
          Optionally pick a password to protect your wallet.
        </Typography>
        <TextField
          variant="outlined"
          fullWidth
          margin="normal"
          label="New Password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          variant="outlined"
          fullWidth
          margin="normal"
          label="Confirm Password"
          type="password"
          autoComplete="new-password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
        <Typography>
          If you forget your password you will need to restore your wallet using
          your seed words.
        </Typography>
      </CardContent>
      <CardActions style={{ justifyContent: 'space-between' }}>
        <Button onClick={goBack}>Back</Button>
        <Button
          color="primary"
          disabled={password !== passwordConfirm}
          onClick={() => onSubmit(password)}
        >
          Create Wallet
        </Button>
      </CardActions>
    </Card>
  );
}

function LoginForm() {
  const [password, setPassword] = useState('');
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const callAsync = useCallAsync();

  const submit = () => {
    callAsync(loadMnemonicAndSeed(password, stayLoggedIn), {
      progressMessage: 'Unlocking wallet...',
      successMessage: 'Wallet unlocked',
    });
  }
  const submitOnEnter = (e) => {
    if (e.code === "Enter" || e.code === "NumpadEnter") {
      e.preventDefault();
      e.stopPropagation();
      submit();
    }
  }
  const setPasswordOnChange = (e) => setPassword(e.target.value);
  const toggleStayLoggedIn = (e) => setStayLoggedIn(e.target.checked);

  return (
    <Card className="card">
      <CardContent>
        <Typography align="center" variant="h1" gutterBottom>
          Unlock Wallet
        </Typography>
        <TextField
          variant="outlined"
          fullWidth
          margin="normal"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={setPasswordOnChange}
          onKeyDown={submitOnEnter}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={stayLoggedIn}
              onChange={toggleStayLoggedIn}
            />
          }
          label="Keep wallet unlocked"
        />
      </CardContent>
      <CardActions style={{ justifyContent: 'flex-end' }}>
        <Button color="primary" onClick={submit}>
          Unlock
        </Button>
      </CardActions>
    </Card>
  );
}

function RestoreWalletForm({ goBack }) {
  const [rawMnemonic, setRawMnemonic] = useState('');
  const [seed, setSeed] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [next, setNext] = useState(false);

  const mnemonic = normalizeMnemonic(rawMnemonic);
  const isNextBtnEnabled =
    password === passwordConfirm && validateMnemonic(mnemonic);
  const displayInvalidMnemonic = validateMnemonic(mnemonic) === false && mnemonic.length > 0;
  return (
    <>
      {next ? (
        <DerivedAccounts
          goBack={() => setNext(false)}
          mnemonic={mnemonic}
          password={password}
          seed={seed}
        />
      ) : (
        <Card>
          <CardContent>
            <Box mb={4}>
              <Typography align="center" variant="h3" gutterBottom>
                Restore Existing Wallet
              </Typography>
            </Box>
            <Box align="center" my={2}>
              <Typography variant="paragraph">
                Restore your wallet using your twelve or twenty-four seed words.
                Note that this will delete any existing wallet on this device.
              </Typography>
            </Box>
            <Box align="center">
              <Typography variant="paragraph" fontWeight="fontWeightBold">
                <b>Do not enter your hardware wallet seedphrase here.</b>
              </Typography>
            </Box>
            <Box align="center" mb={4}>
              <Typography variant="paragraph" fontWeight="fontWeightBold">
                Hardware wallets can be optionally connected after a web wallet is created.
              </Typography>
            </Box>

            <TextField
              variant="outlined"              
              fullWidth
              multiline
              rows={5}
              margin="normal"
              label="Seed Words"
              value={rawMnemonic}
              onChange={(e) => setRawMnemonic(e.target.value)}
            />
            {displayInvalidMnemonic && (
               <Typography fontWeight="fontWeightBold" style={{ fontSize: '12px', color: 'red' }}>
                 Mnemonic validation failed. Please enter a valid BIP 39 seed phrase.
               </Typography>
            )}
            <TextField
              variant="outlined"
              fullWidth
              margin="normal"
              label="New Password (Optional)"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              variant="outlined"
              fullWidth
              margin="normal"
              label="Confirm Password"
              type="password"
              autoComplete="new-password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </CardContent>
          <CardActions style={{ justifyContent: 'space-between' }}>
            <Button onClick={goBack}>Cancel</Button>
            <Button
              color="primary"
              disabled={!isNextBtnEnabled}
              onClick={() => {
                mnemonicToSeed(mnemonic).then((seed) => {
                  setSeed(seed);
                  setNext(true);
                });
              }}
            >
              Next
            </Button>
          </CardActions>
        </Card>
      )}
    </>
  );
}

function DerivedAccounts({ goBack, mnemonic, seed, password }) {
  const callAsync = useCallAsync();
  const [dPathMenuItem, setDPathMenuItem] = useState(
    DerivationPathMenuItem.Bip44Change,
  );
  const accounts = [...Array(10)].map((_, idx) => {
    return getAccountFromSeed(
      Buffer.from(seed, 'hex'),
      idx,
      toDerivationPath(dPathMenuItem),
    );
  });

  function submit() {
    callAsync(
      storeMnemonicAndSeed(
        mnemonic,
        seed,
        password,
        toDerivationPath(dPathMenuItem),
      ),
    );
  }

  return (
    <Card>
      <AccountsSelector
        showDeprecated={true}
        accounts={accounts}
        dPathMenuItem={dPathMenuItem}
        setDPathMenuItem={setDPathMenuItem}
      />
      <CardActions style={{ justifyContent: 'space-between' }}>
        <Button onClick={goBack}>Back</Button>
        <Button color="primary" onClick={submit}>
          Restore
        </Button>
      </CardActions>
    </Card>
  );
}

export function AccountsSelector({
  showRoot,
  showDeprecated,
  accounts,
  dPathMenuItem,
  setDPathMenuItem,
  onClick,
}) {
  return (
    <CardContent>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h5" gutterBottom>
          Derivable Accounts
        </Typography>
        <FormControl variant="outlined">
          <Select
            value={dPathMenuItem}
            onChange={(e) => {
              setDPathMenuItem(e.target.value);
            }}
          >
            {showRoot && (
              <MenuItem value={DerivationPathMenuItem.Bip44Root}>
                {`m/44'/501'`}
              </MenuItem>
            )}
            <MenuItem value={DerivationPathMenuItem.Bip44}>
              {`m/44'/501'/0'`}
            </MenuItem>
            <MenuItem value={DerivationPathMenuItem.Bip44Change}>
              {`m/44'/501'/0'/0'`}
            </MenuItem>
            {showDeprecated && (
              <MenuItem value={DerivationPathMenuItem.Deprecated}>
                {`m/501'/0'/0/0 (deprecated)`}
              </MenuItem>
            )}
          </Select>
        </FormControl>
      </div>
      {accounts.map((acc) => {
        return (
          <div onClick={onClick ? () => onClick(acc) : {}}>
            <BalanceListItem
              key={acc.publicKey.toString()}
              onClick={onClick}
              publicKey={acc.publicKey}
              expandable={false}
            />
          </div>
        );
      })}
    </CardContent>
  );
}

// Material UI's Select doesn't render properly when using an `undefined` value,
// so we define this type and the subsequent `toDerivationPath` translator as a
// workaround.
//
// DERIVATION_PATH.deprecated is always undefined.
export const DerivationPathMenuItem = {
  Deprecated: 0,
  Bip44: 1,
  Bip44Change: 2,
  Bip44Root: 3, // Ledger only.
};

export function toDerivationPath(dPathMenuItem) {
  switch (dPathMenuItem) {
    case DerivationPathMenuItem.Deprecated:
      return DERIVATION_PATH.deprecated;
    case DerivationPathMenuItem.Bip44:
      return DERIVATION_PATH.bip44;
    case DerivationPathMenuItem.Bip44Change:
      return DERIVATION_PATH.bip44Change;
    case DerivationPathMenuItem.Bip44Root:
      return DERIVATION_PATH.bip44Root;
    default:
      throw new Error(`invalid derivation path: ${dPathMenuItem}`);
  }
}
