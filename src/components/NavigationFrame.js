import React from 'react';
import { Layout, Menu, Dropdown, Grid, Button } from 'antd';
import { CodeOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { useConnectionConfig, MAINNET_URL } from '../utils/connection';
import { clusterApiUrl } from '@solana/web3.js';
import { useWalletSelector } from '../utils/wallet';
import SolanaIcon from './SolanaIcon';

const { Header, Content, Footer } = Layout;
const { useBreakpoint } = Grid;

export default function NavigationFrame({ children }) {
  return (
    <Layout style={{ height: '100vh' }}>
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
      <Content
        style={{
          flex: 1,
          overflow: 'auto',
          paddingTop: 100,
          paddingBottom: 36,
        }}
      >
        {children}
      </Content>
      <Footer>
        <Button
          type="link"
          component="a"
          href="https://github.com/serum-foundation/spl-token-wallet"
          target="_blank"
          rel="noopener"
          icon={<CodeOutlined />}
        >
          View Source
        </Button>
      </Footer>
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
          <Menu.Item key={addresses.length} icon={<PlusOutlined />}>
            Create account
          </Menu.Item>
        </Menu>
      }
    >
      {screens['md'] ? (
        <Button type="link">Account</Button>
      ) : (
        <UserOutlined style={{ fontSize: 24, marginRight: 8 }} />
      )}
    </Dropdown>
  );
}
