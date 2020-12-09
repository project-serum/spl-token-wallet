import React, { useEffect, useState } from 'react';
import {
  generateMnemonicAndSeed,
  hasLockedMnemonicAndSeed,
  loadMnemonicAndSeed,
  mnemonicToSeed,
  storeMnemonicAndSeed,
} from '../utils/wallet-seed';
import Container from '@material-ui/core/Container';
import LoadingIndicator from '../components/LoadingIndicator';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { useCallAsync } from '../utils/notifications';
import Link from '@material-ui/core/Link';

export default function LoginPage() {
  const [restore, setRestore] = useState(false);
  return (
    <Container maxWidth="sm">
      {restore ? (
        <RestoreWalletForm goBack={() => setRestore(false)} />
      ) : (
          <>
            {hasLockedMnemonicAndSeed() ? <LoginForm /> : <CreateWalletForm />}
            <br />
            <Link style={{ cursor: 'pointer' }} onClick={() => setRestore(true)}>
              Restaurar uma carteira existente
          </Link>
          </>
        )}
    </Container>
  );
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
    callAsync(storeMnemonicAndSeed(mnemonic, seed, password), {
      progressMessage: 'Criando sua carteira...',
      successMessage: 'Carteira Criada',
    });
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

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Criar uma Nova Carteira
        </Typography>
        <Typography paragraph>
          Criar uma Nova Carteira para armazenar Solana e SPL Tokens
        </Typography>
        <Typography>
          Por favor escreva e guarde em um local seguro as 12 (doze) palavras apresentadas a seguir:
        </Typography>
        {mnemonicAndSeed ? (
          <TextField
            variant="outlined"
            fullWidth
            multiline
            margin="normal"
            value={mnemonicAndSeed.mnemonic}
            label="Palavras Secretas (seed words)"
            onFocus={(e) => e.currentTarget.select()}
          />
        ) : (
            <LoadingIndicator />
          )}
        <Typography paragraph>
          Sua chave privada é armazenada somente no SEU computador or dispositivo de acesso.
          Você precisara dessas palavras secretas (seed words) para restaurar a sua wallet em
          outro dispositivo se o histórico do browser foi limpo.
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={confirmed}
              disabled={!mnemonicAndSeed}
              onChange={(e) => setConfirmed(e.target.checked)}
            />
          }
          label="Eu salvei as palavras em um lugar seguro."
        />
      </CardContent>
      <CardActions style={{ justifyContent: 'flex-end' }}>
        <Button color="primary" disabled={!confirmed} onClick={goForward}>
          Continuar
        </Button>
      </CardActions>
    </Card>
  );
}

function ChoosePasswordForm({ goBack, onSubmit }) {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Escolher uma senha (Opcional)
        </Typography>
        <Typography>
          Escolha uma senha para proteger a sua wallet.
        </Typography>
        <TextField
          variant="outlined"
          fullWidth
          margin="normal"
          label="Nova Senha"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          variant="outlined"
          fullWidth
          margin="normal"
          label="Confirmar Senha"
          type="password"
          autoComplete="new-password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
        <Typography>
          Se você esquecer a senha você precisara restaurar as sua wallet usando as palavras secretas.
        </Typography>
      </CardContent>
      <CardActions style={{ justifyContent: 'space-between' }}>
        <Button onClick={goBack}>Voltar</Button>
        <Button
          color="primary"
          disabled={password !== passwordConfirm}
          onClick={() => onSubmit(password)}
        >
          Criar uma Carteira
        </Button>
      </CardActions>
    </Card>
  );
}

function LoginForm() {
  const [password, setPassword] = useState('');
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const callAsync = useCallAsync();

  function submit() {
    callAsync(loadMnemonicAndSeed(password, stayLoggedIn), {
      progressMessage: 'Desbloqueando a carteira...',
      successMessage: 'Cartiera desbloqueada',
    });
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Desbloquear Carteira
        </Typography>
        <TextField
          variant="outlined"
          fullWidth
          margin="normal"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={stayLoggedIn}
              onChange={(e) => setStayLoggedIn(e.target.checked)}
            />
          }
          label="Manter minha carteira desbloqueada"
        />
      </CardContent>
      <CardActions style={{ justifyContent: 'flex-end' }}>
        <Button color="primary" onClick={submit}>
          Desbloquear
        </Button>
      </CardActions>
    </Card>
  );
}

function RestoreWalletForm({ goBack }) {
  const [mnemonic, setMnemonic] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const callAsync = useCallAsync();

  function submit() {
    callAsync(
      mnemonicToSeed(mnemonic).then((seed) =>
        storeMnemonicAndSeed(mnemonic, seed, password),
      ),
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Restaurar Carteira Existente
        </Typography>
        <Typography>
          Restaure sua carteira usando as 12 (doze) palavras secretas. Atenção isso irá eliminar todos os dados atuais.
        </Typography>
        <TextField
          variant="outlined"
          fullWidth
          multiline
          rows={3}
          margin="normal"
          label="Palavras Secretas"
          value={mnemonic}
          onChange={(e) => setMnemonic(e.target.value)}
        />
        <TextField
          variant="outlined"
          fullWidth
          margin="normal"
          label="Nova Senha (Opcional)"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          variant="outlined"
          fullWidth
          margin="normal"
          label="Confirmar Senha"
          type="password"
          autoComplete="new-password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
      </CardContent>
      <CardActions style={{ justifyContent: 'space-between' }}>
        <Button onClick={goBack}>Fechar</Button>
        <Button
          color="primary"
          disabled={password !== passwordConfirm}
          onClick={submit}
        >
          Restaurar
        </Button>
      </CardActions>
    </Card>
  );
}
