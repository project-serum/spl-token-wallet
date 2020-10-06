import React from 'react';
import { Layout, Menu, Dropdown, Grid, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { makeStyles } from '@material-ui/core/styles';
import { useConnectionConfig, MAINNET_URL } from '../utils/connection';
import { clusterApiUrl } from '@solana/web3.js';
import { useWalletSelector } from '../utils/wallet';
import AccountIcon from '@material-ui/icons/AccountCircle';
import SolanaIcon from './SolanaIcon';
import CodeIcon from '@material-ui/icons/Code';

const { Header, Content } = Layout;
const { useBreakpoint } = Grid;

export default function NavigationFrame({ children }) {
  return (
    <Layout>
      <Header
        style={{
          position: 'fixed',
          zIndex: 1,
          width: '100%',
          backgroundColor: '#f7f7f7',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="/solana.svg"
            alt="logo"
            style={{ height: 18, marginTop: 2, marginRight: 10 }}
          />
          <span style={{ fontSize: 24 }}>Sollet.io</span>
          <div style={{ flex: 1 }} />
          <WalletSelector />
          <NetworkSelector />
        </div>
      </Header>
      <Content style={{ flexGrow: 1, marginTop: 100 }}>{children}</Content>
      <Footer />
    </Layout>
  );
}

function NetworkSelector() {
  const { endpoint, setEndpoint } = useConnectionConfig();
  const screens = useBreakpoint();

  const networks = [
    MAINNET_URL,
    clusterApiUrl('devnet'),
    clusterApiUrl('testnet'),
    'http://localhost:8899',
  ];

  const networkLabels = {
    [MAINNET_URL]: 'Mainnet Beta',
    [clusterApiUrl('devnet')]: 'Devnet',
    [clusterApiUrl('testnet')]: 'Testnet',
  };

  return (
    <Dropdown
      overlay={
        <Menu selectedKeys={[endpoint]} onClick={(e) => setEndpoint(e.key)}>
          {networks.map((network) => (
            <Menu.Item key={network}>{network}</Menu.Item>
          ))}
        </Menu>
      }
    >
      {screens['md'] ? (
        <Button type="link">{networkLabels[endpoint] ?? 'Network'}</Button>
      ) : (
        <SolanaIcon />
      )}
    </Dropdown>
  );
}

function WalletSelector() {
  const { addresses, walletIndex, setWalletIndex } = useWalletSelector();
  const screens = useBreakpoint();

  if (addresses.length === 0) {
    return null;
  }

  return (
    <Dropdown
      overlay={
        <Menu
          selectedKeys={[walletIndex + '']}
          onClick={(e) => setWalletIndex(Number(e.key))}
        >
          {addresses.map((address, index) => (
            <Menu.Item key={index + ''}>{address.toBase58()}</Menu.Item>
          ))}
          <Menu.Item
            key={addresses.length}
            icon={<PlusOutlined />}
          >
            Create account
          </Menu.Item>
        </Menu>
      }
    >
      {screens['md'] ? <Button type="link">Account</Button> : <AccountIcon />}
    </Dropdown>
  );
}

const useFooterStyles = makeStyles((theme) => ({
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    margin: theme.spacing(2),
  },
}));

function Footer() {
  const classes = useFooterStyles();
  return (
    <footer className={classes.footer}>
      <Button
        variant="outlined"
        color="primary"
        component="a"
        target="_blank"
        rel="noopener"
        href="https://github.com/serum-foundation/spl-token-wallet"
        startIcon={<CodeIcon />}
      >
        View Source
      </Button>
    </footer>
  );
}
