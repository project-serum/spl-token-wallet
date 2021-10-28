import { useTheme } from '@material-ui/core';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import AldrinLogo from '../../images/Aldrin.svg';
import StakeBtn from '../../images/stakeBtn.png';
import { Row, RowContainer } from '../../pages/commonStyles';
import { Button } from '../Button';
import { FeedbackPopup } from '../UsersFeedBackPopup/UsersFeedbackPopup';
import { COLORS } from '../variables';
import DiscordIcon from './DiscordIcon';
// TODO: Refactor popup
import { DropDown } from './Dropdown';
import {
  Body,
  HeaderWrap,
  LinksBlock,
  Logo,
  LogoBlock,
  LogoLink,
  MainLinksBlock,
  MainLinksWrap,
  NavLink,
  WalletContainer,
} from './styles';
import TelegramIcon from './TelegramIcon';
import TwitterIcon from './TwitterIcon';

const Socials = styled(Row)`
  & a:hover {
    svg {
      g {
        path {
          fill: #4679f4;
        }
      }
    }
  }
`;

const StyledLink = styled.a`
  height: 100%;
`;

export const Navbar = () => {
  const [feedbackPopupOpen, setFeedbackPopupOpen] = useState(false);
  const theme = useTheme();

  // const { pathname } = useLocation();

  const feedbackLinks = (
    <>
      <NavLink as="button" onClick={() => setFeedbackPopupOpen(true)}>
        Feedback &amp; Support
      </NavLink>
    </>
  );

  return (
    <Body>
      <HeaderWrap>
        <LogoBlock>
          <LogoLink to={'/'}>
            <Logo src={AldrinLogo} />
          </LogoLink>
          <Button
            backgroundImage={StakeBtn}
            as={Link}
            to="/staking"
            fontSize="xs"
            padding="md"
            borderRadius="xxl"
          >
            Stake RIN
          </Button>
        </LogoBlock>
        <LinksBlock>{feedbackLinks}</LinksBlock>
        <MainLinksWrap>
          <MainLinksBlock>
            <DropDown text="Trading" isActive={false}>
              {' '}
              <NavLink
                as="a"
                href="https://dex.aldrin.com/chart/spot/RIN_USDC"
                activeClassName="selected"
              >
                Terminal
              </NavLink>
              <NavLink
                as="a"
                href="https://dex.aldrin.com/swap"
                activeClassName="selected"
              >
                Swap
              </NavLink>
            </DropDown>

            <NavLink
              as="a"
              href="https://dex.aldrin.com/rebalance"
              activeClassName="selected"
            >
              Rebalance
            </NavLink>
            <NavLink
              as="a"
              href="https://dex.aldrin.com/dashboard"
              activeClassName="selected"
            >
              Dashboard
            </NavLink>
            <NavLink
              style={{
                color: COLORS.navLinkActive,
                background: COLORS.navLinkActiveBg,
              }}
              to="/wallet"
              activeClassName="selected"
            >
              Wallet
            </NavLink>
            <NavLink
              new
              show="md"
              as="a"
              href="https://dex.aldrin.com/pools"
              activeClassName="selected"
            >
              Pools
            </NavLink>
            <NavLink
              show="md"
              as="a"
              target="_blank"
              href="https://docs.aldrin.com/dex/how-to-get-started-on-aldrin-dex"
            >
              FAQ
            </NavLink>

            <DropDown hide="lg" text="···">
              {feedbackLinks}
              <NavLink hide="md" activeClassName="selected" to="/pools">
                Liquidity Pools
              </NavLink>
              <NavLink
                hide="md"
                as="a"
                target="_blank"
                href="https://docs.aldrin.com/dex/how-to-get-started-on-aldrin-dex"
              >
                FAQ
              </NavLink>
            </DropDown>
          </MainLinksBlock>
        </MainLinksWrap>
        <WalletContainer>
          <RowContainer padding="0">
            <Socials justify={'space-around'} height="100%" width={'auto'}>
              <StyledLink
                style={{ marginRight: '3rem', height: '2.5rem' }}
                target="_blank"
                rel="noopener noreferrer"
                href="https://twitter.com/Aldrin_Exchange"
              >
                <TwitterIcon />
              </StyledLink>
              <StyledLink
                style={{ marginRight: '3rem', height: '2.5rem' }}
                target="_blank"
                rel="noopener noreferrer"
                href="https://t.me/Aldrin_Exchange"
              >
                <TelegramIcon />
              </StyledLink>
              <StyledLink
                target="_blank"
                rel="noopener noreferrer"
                href="https://discord.gg/4VZyNxT2WU"
                style={{ height: '2.5rem' }}
              >
                <DiscordIcon />
              </StyledLink>
            </Socials>
          </RowContainer>
        </WalletContainer>
      </HeaderWrap>
      <FeedbackPopup
        theme={theme}
        open={feedbackPopupOpen}
        onClose={() => {
          setFeedbackPopupOpen(false);
        }}
      />
    </Body>
  );
};
