import React from 'react';
import styled from 'styled-components';
import { useLocation, Link } from 'react-router-dom';
import { GridContainer, RowContainer, Row } from '../../pages/commonStyles';
import { Button, Theme } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { CSSProperties } from '@material-ui/styles';
import WalletLogo from '../../images/logo.svg';
import NetworkDropdown from './NetworkDropdown';

const StyledButton = styled(Button)`
  font-size: 12px;

  @media only screen and (max-width: 1100px) {
    font-size: 9px;
  }
  @media only screen and (min-width: 2367px) {
    font-size: 1rem;
  }
`;

const SButton = styled(
  ({
    isActivePage,
    type,
    white,
    black,
    style,
    borderColor,
    btnWidth,
    ...rest
  }) => <StyledButton {...rest} />,
)`
  && {
    color: ${(props) => (props.isActivePage ? props.dark : props.grey)};
    background: ${(props) =>
      props.isActivePage ? props.borderColor : props.theme.palette.grey.main};
    font-family: Avenir Next Demi;
    letter-spacing: 0.05rem;
    font-size: 1.2rem;
    transition: 0.35s all;
    width: 10rem;
    margin-right: 1rem;
    height: 100%;
    padding: 0;
    border-radius: 0.6rem;
    text-transform: capitalize;

    @media only screen and (max-width: 1100px) {
      margin: 0;
    }

    &:hover {
      color: ${(props) => props.dark};
      background: ${(props) => props.borderColor};
    }

    ${(props) => props.style}
  }
`;

const NavLinkButton = ({
  component,
  children,
  pathname,
  theme,
  theme: { customPalette },
  page,
  style,
  onClick,
}: {
  component: any;
  children: React.ReactChild;
  pathname: string;
  theme: Theme;
  page: string;
  style?: CSSProperties;
  onClick?: () => void;
}) => {
  const isActivePage = new RegExp(page, 'i').test(pathname);

  return (
    <SButton
      theme={theme}
      pathname={pathname}
      component={component}
      isActivePage={isActivePage}
      grey={customPalette.grey.light}
      dark={customPalette.white.main}
      borderColor={customPalette.grey.border}
      btnWidth={'14rem'}
      size="medium"
      color="default"
      variant="text"
      style={style}
      onClick={onClick}
    >
      {children}
    </SButton>
  );
};

const Navbar = () => {
  const location = useLocation();
  const theme = useTheme();

  return (
    <GridContainer theme={theme}>
      <RowContainer justify={'space-between'} height={'100%'}>
        <RowContainer theme={theme} height={'100%'}>
          <Link
            to={'/'}
            style={{
              padding: '1rem 0',
              height: '100%',
            }}
          >
            <img
              style={{
                height: '100%',
              }}
              alt="logo"
              src={WalletLogo}
            />
          </Link>
          <RowContainer
            padding={'1rem 4rem 1rem 4rem'}
            height={'100%'}
            margin={' 0 0 0 4rem'}
            style={{
              borderRight: theme.customPalette.border.main,
              borderLeft: theme.customPalette.border.main,
            }}
          >
            <NavLinkButton
              theme={theme}
              pathname={location.pathname}
              page={'chart'}
              component={(props) => (
                <a href={`https://dex.cryptocurrencies.ai/chart`} {...props}>
                  {props.children}
                </a>
              )}
            >
              Trading
            </NavLinkButton>
            <NavLinkButton
              theme={theme}
              page={'analytics'}
              pathname={location.pathname}
              component={(props) => (
                <a
                  href={`https://dex.cryptocurrencies.ai/analytics`}
                  {...props}
                >
                  {props.children}
                </a>
              )}
            >
              Analytics
            </NavLinkButton>
            <NavLinkButton
              theme={theme}
              page={'addressbook'}
              pathname={location.pathname}
              component={(props) => (
                <a
                  href={`https://dex.cryptocurrencies.ai/addressbook`}
                  {...props}
                >
                  {props.children}
                </a>
              )}
            >
              Addressbook
            </NavLinkButton>
            <NavLinkButton
              theme={theme}
              data-tut="farming"
              pathname={location.pathname}
              page={''}
              component={(props) => <Link to={`/`} {...props} />}
            >
              Wallet
            </NavLinkButton>
          </RowContainer>
        </RowContainer>
        <Row height={'100%'}>
          <NetworkDropdown />
          {/* <Link style={{ textDecoration: 'none' }} to={'/connect_wallet'}>
            <BtnCustom
              btnWidth={'14rem'}
              height={'3.5rem'}
              borderRadius=".6rem"
              borderColor={theme.customPalette.blue.serum}
              btnColor={theme.customPalette.white.main}
              backgroundColor={theme.customPalette.blue.serum}
              fontSize={'1.2rem'}
              textTransform={'capitalize'}
              margin={'0 0 0 3rem'}
              style={{
                display: 'flex',
                textTransform: 'none',
                padding: '1rem',
                textDeration: 'none',
              }}
            >
              Connect Wallet™
            </BtnCustom>
          </Link>
          <Link style={{ textDecoration: 'none' }} to={'/create_wallet'}>
            <BtnCustom
              btnWidth={'14rem'}
              height={'3.5rem'}
              borderRadius=".6rem"
              btnColor={theme.customPalette.blue.serum}
              fontSize={'1.2rem'}
              textTransform={'capitalize'}
              margin={'0 0 0 3rem'}
              style={{
                display: 'flex',
                textTransform: 'none',
                padding: '1rem',
                textDeration: 'none',
              }}
            >
              Create Wallet
            </BtnCustom>
          </Link> */}
        </Row>
      </RowContainer>
    </GridContainer>
  );
};

export default Navbar;
