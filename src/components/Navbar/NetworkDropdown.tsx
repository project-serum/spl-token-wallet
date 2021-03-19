import React from 'react';
import styled from 'styled-components';
import { useConnectionConfig, MAINNET_URL } from '../../utils/connection';
import { clusterApiUrl } from '@solana/web3.js';
import { Theme, useTheme, Paper, MenuList, MenuItem } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { BtnCustom } from '../BtnCustom';
import { useWallet } from '../../utils/wallet';
import { hasLockedMnemonicAndSeed } from '../../utils/wallet-seed';

export const StyledDropdown = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
  height: 100%;
  &:hover > div {
    display: block !important;
  }
  padding: 1rem 3rem 1rem 0;
  border-right: ${(props) => props.theme.customPalette.border.new};
`;

export const StyledPaper = styled(
  ({
    customNotActiveRem,
    customActiveRem,
    isWalletConnected,
    theme,
    ...props
  }) => <Paper {...props} />,
)`
  display: none;
  &&& {
    z-index: 11;
    position: absolute;
    top: calc(6rem - 0.1rem);
    right: ${(props) =>
      props.isWalletConnected
        ? props.customActiveRem
          ? props.customActiveRem
          : `9rem`
        : props.customNotActiveRem
        ? props.customNotActiveRem
        : '3rem'};
    width: calc(14rem);
    height: auto;
    box-shadow: 0px 0.4rem 0.8rem rgba(10, 19, 43, 0.1);
    border: ${(props) => props.theme.customPalette.border.main};
    background: ${(props) => props.theme.customPalette.white.background};
    border-radius: 0rem;
    /* border-top-left-radius: 0;
    border-top-right-radius: 0; */
    /* padding-left: 8px;
    padding-right: 8px; */
  }
`;

export const StyledMenuItem = styled(MenuItem)`
  /* padding: 0.3rem 0 0.3rem 0.4rem; */
  padding: 0;
  height: auto;
  color: ${(props) => props.theme.customPalette.grey.light};
  background: ${(props) => props.theme.customPalette.white.background};

  svg {
    font-size: 14px;
  }

  &:hover {
    background: transparent;
  }

  @media (min-width: 1921px) {
    /* padding: 0.5rem 0; */

    svg {
      font-size: 1.5rem;
    }
  }

  @media (min-width: 2560px) {
    /* padding: 0.4rem 0; */

    svg {
      font-size: 1.3rem;
    }
  }
`;

const WalletStatusButton = ({
  connection,
  theme,
}: {
  connection: string;
  theme: Theme;
}) => (
  <BtnCustom
    btnColor={theme.customPalette.white.main}
    borderWidth={'0'}
    textTransform={'capitalize'}
    btnWidth={'10rem'}
    height={'3.5rem'}
    padding={'1.25rem 0'}
    fontSize={'1.2rem'}
  >
    {connection}
    <ExpandMoreIcon fontSize="small" style={{ marginLeft: '.5rem' }} />
  </BtnCustom>
);

const NetworkDropdown = () => {
  const theme = useTheme();
  const wallet = useWallet();
  const { endpoint, setEndpoint } = useConnectionConfig();

  const networkLabels = [
    { name: 'Mainnet Beta', endpoint: MAINNET_URL },
    { name: 'Devnet', endpoint: clusterApiUrl('devnet') },
    { name: 'Testnet', endpoint: clusterApiUrl('testnet') },
  ];

  const currentConnectionEndpoint = {
    value: endpoint,
    label: networkLabels.find((a) => a.endpoint === endpoint)?.name || '',
  };

  const isUserHasLockedMnemonicAndSeed = hasLockedMnemonicAndSeed();

  return (
    <StyledDropdown
      theme={theme}
      style={{
        margin: '0 0rem 0 3rem',
        height: '100%',
      }}
    >
      <WalletStatusButton
        connection={currentConnectionEndpoint.label}
        theme={theme}
      />
      <StyledPaper
        theme={theme}
        isWalletConnected={false}
        customNotActiveRem={
          !!wallet ? '37rem' : isUserHasLockedMnemonicAndSeed ? '22rem' : '38rem'
        }
      >
        <MenuList style={{ padding: 0 }}>
          {networkLabels.map((endpoint) => (
            <StyledMenuItem
              theme={theme}
              disableRipple
              disableGutters={true}
              key={`${endpoint.name}`}
            >
              <BtnCustom
                btnWidth={'100%'}
                height={'4rem'}
                border="none"
                borderWidth="0"
                borderRadius="0"
                btnColor={
                  currentConnectionEndpoint.label === endpoint.name
                    ? '#AAF2C9'
                    : '#ECF0F3'
                }
                fontSize={'1.2rem'}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  textTransform: 'none',
                  padding: '1rem',
                }}
                onClick={() => {
                  setEndpoint(endpoint.endpoint);
                }}
              >
                {endpoint.name}
              </BtnCustom>
            </StyledMenuItem>
          ))}
        </MenuList>
      </StyledPaper>
    </StyledDropdown>
  );
};

export default NetworkDropdown;
