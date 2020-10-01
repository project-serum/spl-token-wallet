import React, { useEffect, useState } from 'react';
import { Layout, Row, Col, Typography, Input, Switch, Space, Tag } from 'antd';
import {
  WalletOutlined,
  CloseOutlined,
  CheckOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import {
  generateMnemonicAndSeed,
  hasLockedMnemonicAndSeed,
  loadMnemonicAndSeed,
  mnemonicToSeed,
  storeMnemonicAndSeed,
} from '../utils/wallet-seed';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { useCallAsync } from '../utils/notifications';
import {
  Box,
  CreateWalletBox,
  RestoreWalletBox,
  WarningBox,
  Text,
  ActionButton,
} from '../components/layout/StyledComponents';

const { Content } = Layout;
const { TextArea } = Input;
const { Title, Paragraph } = Typography;

export default function LoginPage() {
  return (
    <div style={{ marginTop: 48 }}>
      {hasLockedMnemonicAndSeed() ? <LoginForm /> : <EntryPoint />}
    </div>
  );
}

function EntryPoint() {
  const [formType, setFormType] = useState(null);

  if (!formType) {
    return (
      <Row justify="center" gutter={[24]}>
        <Col>
          <CreateWalletBox
            style={{
              width: 300,
              height: 200,
              backgroundColor: '#00d2d3',
              textAlign: 'center',
            }}
            onClick={() => setFormType('new')}
          >
            <WalletOutlined
              style={{ color: 'white', fontSize: 24, marginBottom: 10 }}
            />
            <Title level={3} style={{ color: 'white' }}>
              Create new wallet
            </Title>
            <Paragraph style={{ color: 'white' }}>
              Create a new wallet to hold Solana and SPL tokens.
            </Paragraph>
          </CreateWalletBox>
        </Col>
        <Col>
          <RestoreWalletBox
            style={{
              width: 300,
              height: 200,
              backgroundColor: '#54a0ff',
              textAlign: 'center',
            }}
            onClick={() => setFormType('restore')}
          >
            <WalletOutlined
              style={{ color: 'white', fontSize: 24, marginBottom: 10 }}
            />
            <Title level={3} style={{ color: 'white' }}>
              Restore wallet
            </Title>
            <Paragraph style={{ color: 'white' }}>
              Restore your wallet using your twelve seed words.
            </Paragraph>
          </RestoreWalletBox>
        </Col>
      </Row>
    );
  }

  return formType === 'restore' ? (
    <RestoreWalletForm goBack={() => setFormType(null)} />
  ) : (
    <CreateWalletForm goBack={() => setFormType(null)} />
  );
}

function CreateWalletForm({ goBack }) {
  const [mnemonicAndSeed, setMnemonicAndSeed] = useState(null);
  useEffect(() => {
    generateMnemonicAndSeed().then(setMnemonicAndSeed);
  }, []);
  const [savedWords, setSavedWords] = useState(false);
  const callAsync = useCallAsync();

  function submit(password) {
    const { mnemonic, seed } = mnemonicAndSeed;
    callAsync(storeMnemonicAndSeed(mnemonic, seed, password), {
      progressMessage: 'Creating wallet...',
      successMessage: 'Wallet created',
    });
  }

  if (!savedWords) {
    return (
      <SeedWordsForm
        mnemonicAndSeed={mnemonicAndSeed}
        goBack={goBack}
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

function SeedWordsForm({ mnemonicAndSeed, goBack, goForward }) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <Row justify="center">
      <Col flex="500px" style={{ backgroundColor: 'white' }}>
        <Box>
          <Space align="start">
            <ArrowLeftOutlined
              style={{ color: '#00d2d3', fontSize: 30, marginTop: 5 }}
              onClick={goBack}
            />
            <Title level={2} style={{ color: '#00d2d3' }}>
              Create new wallet
            </Title>
          </Space>
          <Space direction="vertical">
            <Text>Create a new wallet to hold Solana and SPL tokens.</Text>
            <Text>
              Please write down the following twelve words and keep them in a
              safe place:
            </Text>
            <TextArea
              placeholder="Loading seed..."
              value={mnemonicAndSeed?.mnemonic}
              contentEditable={false}
              style={{ fontWeight: 500 }}
              autoSize
            />
            <WarningBox>
              Your private keys are only stored on your current computer or
              device. You will need these words to restore your wallet if your
              browser's storage is cleared or your device is damaged or lost.
            </WarningBox>
            <div
              style={{
                display: 'flex',
                backgroundColor: '#f7f7f7',
                padding: 10,
                borderRadius: 10,
              }}
            >
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                onChange={setConfirmed}
                checked={confirmed}
              />
              <span style={{ marginLeft: 8, fontWeight: 500 }}>
                I have saved these words in a safe place.
              </span>
            </div>
          </Space>
          <ActionButton
            block
            type="primary"
            size="large"
            disabled={!confirmed}
            onClick={goForward}
          >
            <span style={{ fontWeight: 500 }}>Continue</span>
          </ActionButton>
        </Box>
      </Col>
    </Row>
  );
}

function ChoosePasswordForm({ goBack, onSubmit }) {
  const [password, setPassword] = useState(null);
  const [passwordConfirm, setPasswordConfirm] = useState(null);

  return (
    <Row justify="center">
      <Col flex="500px" style={{ backgroundColor: 'white' }}>
        <Box>
          <Space align="start">
            <ArrowLeftOutlined
              style={{ color: '#00d2d3', fontSize: 30, marginTop: 5 }}
              onClick={goBack}
            />
            <Title level={2} style={{ color: '#00d2d3' }}>
              Choose a Password (Optional)
            </Title>
          </Space>
          <Space direction="vertical">
            <Text>Optionally pick a password to protect your wallet.</Text>
            <Text>
              Please write down the following twelve words and keep them in a
              safe place:
            </Text>
            <Input.Password
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
            <Input.Password
              placeholder="Confirm Password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
            <Text>
              If you forget your password you will need to restore your wallet
              using your seed words.
            </Text>
          </Space>
          <ActionButton
            block
            type="primary"
            size="large"
            disabled={!password || password !== passwordConfirm}
            onClick={() => onSubmit(password)}
          >
            <span style={{ fontWeight: 500 }}>Create wallet</span>
          </ActionButton>
        </Box>
      </Col>
    </Row>
  );
}

function LoginForm() {
  const [password, setPassword] = useState('');
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const callAsync = useCallAsync();

  function submit() {
    callAsync(loadMnemonicAndSeed(password, stayLoggedIn), {
      progressMessage: 'Unlocking wallet...',
      successMessage: 'Wallet unlocked',
    });
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
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
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={stayLoggedIn}
              onChange={(e) => setStayLoggedIn(e.target.checked)}
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
    <Row justify="center">
      <Col flex="500px" style={{ backgroundColor: 'white' }}>
        <Box>
          <Space align="start">
            <ArrowLeftOutlined
              style={{ color: '#00d2d3', fontSize: 30, marginTop: 5 }}
              onClick={goBack}
            />
            <Title level={2} style={{ color: '#00d2d3' }}>
              Restore existing wallet
            </Title>
          </Space>
          <Space direction="vertical">
            <Text>
              Restore your wallet using your twelve seed words. Note that this
              will delete any existing wallet on this device.
            </Text>
            <TextArea
              placeholder="Seed words"
              value={mnemonic}
              onChange={(e) => setMnemonic(e.target.value)}
              style={{ fontWeight: 500 }}
              autoSize
            />
            <Input.Password
              placeholder="New Password (Optional)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
            <Input.Password
              placeholder="Confirm Password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Space>
          <ActionButton
            block
            type="primary"
            size="large"
            disabled={!password || password !== passwordConfirm}
            onClick={submit}
          >
            <span style={{ fontWeight: 500 }}>Restore</span>
          </ActionButton>
        </Box>
      </Col>
    </Row>
  );
}
