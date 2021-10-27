import styled from 'styled-components';
import { Link, NavLink as RouterNavLink } from 'react-router-dom';

import { COLORS, SIZE, BORDER_RADIUS, BREAKPOINTS, FONTS } from '../variables';
import { Button } from '../Button';
import { Text } from '../Typography';

// TODO: remove dat
const maxMobileScreenResolution = 600;

export const HeaderWrap = styled.header`
  display: none;
  flex-direction: row;
  height: 48px;
  background: ${COLORS.bodyBackground};
  border-bottom: 1px solid ${COLORS.border};
  padding: 0 ${SIZE.defaultPadding};

  @media (min-width: ${maxMobileScreenResolution}px) {
    display: flex;
  }
`;

export const LogoBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-right: 1px solid ${COLORS.border};
  padding-right: ${SIZE.defaultPadding};
  margin: 8px 0;
`;

interface ShowHideProps {
  show?: keyof typeof BREAKPOINTS;
  hide?: keyof typeof BREAKPOINTS;
}

interface LinkProps extends ShowHideProps {
  new?: boolean;
}

export const NavLink = styled(RouterNavLink)<LinkProps>`
  text-decoration: none;
  font-size: 0.7em;
  padding: 8px 12px;
  margin: 0px 4px;
  text-align: center;
  border-radius: ${BORDER_RADIUS.md};
  color: ${COLORS.hint};
  background: ${COLORS.bodyBackground};
  transition: all ease-in 0.2s;
  border: 0;
  cursor: pointer;
  white-space: nowrap;

  &:hover,
  &.selected {
    color: ${COLORS.navLinkActive};
    background: ${COLORS.navLinkActiveBg};
  }

  ${(props: LinkProps) =>
    props.show
      ? `
    display: none;

    @media(min-width: ${BREAKPOINTS[props.show]}) {
      display: inline;
    }
  `
      : ''}

  ${(props: LinkProps) =>
    props.hide
      ? `
    @media(min-width: ${BREAKPOINTS[props.hide]}) {
      display: none;
    }
  `
      : ''}

  ${(props: LinkProps) =>
    props.new
      ? `
    &:after {
      content: "NEW";
      color: ${COLORS.success};
      position: relative;
      top: -5px;
      font-weight: 600;
      font-size: 0.7em;
      padding-left: 5px;
    }
  `
      : ''}
`;

export const LinksBlock = styled.div`
  display: none;
  flex-direction: row;
  align-items: center;
  padding: 0 5px;
  border-right: 1px solid ${COLORS.border};
  margin: 5px 0;

  @media (min-width: ${BREAKPOINTS.lg}) {
    display: flex;
  }
`;

export const MainLinksWrap = styled(LinksBlock)`
  margin: 5px auto;
  border-right: 0;
  display: flex;
  flex: 1;
  flex-direction: row;
`;

export const MainLinksBlock = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  margin: 0 auto;
  justify-content: space-between;
  max-width: 600px;
`;

export const WalletContainer = styled.div`
  margin: 5px 0 5px auto;
  padding: 0 0 0 ${SIZE.defaultPadding};
  border-left: 1px solid ${COLORS.border};
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow: hidden;
  flex: 0 1 auto;
`;

export const LogoLink = styled(Link)`
  display: block;
  height: 100%;
  margin-right: ${SIZE.defaultPadding};
`;

export const Logo = styled.img`
  height: 100%;
`;

export const DropdownContent = styled.div`
  position: absolute;
  top: 100%;
  flex-direction: column;
  display: none;
  z-index: 1;
  background: rgba(0, 0, 0, 0.001);
`;

export const DropdownWrap = styled.div<ShowHideProps>`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &:hover ${DropdownContent} {
    display: flex;
  }

  ${(props: ShowHideProps) =>
    props.show
      ? `
    display: none;

    @media(min-width: ${BREAKPOINTS[props.show]}) {
      display: flex;
    }
  `
      : ''}

  ${(props: ShowHideProps) =>
    props.hide
      ? `
    @media(min-width: ${BREAKPOINTS[props.hide]}) {
      display: none;
    }
  `
      : ''}
`;

export const DropdownInner = styled.div`
  min-width: 6em;
  background: ${COLORS.bodyBackground};
  border: 1px solid ${COLORS.border};
  display: flex;
  flex-direction: column;
  margin-top: 5px;
  padding: 5px 0;
`;

export const WalletButton = styled(Button)`
  padding: 4px 20px;
  font-size: 0.75em;

  @media (min-width: ${BREAKPOINTS.lg}) {
    width: 238px;
  }
`;

export const WalletData = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - 48px);
`;

export const WalletName = styled(Text)`
  font-size: 0.6em;
  line-height: 1.3;
  margin: 0;
  color: ${COLORS.primaryWhite};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: bold;
`;

export const WalletAddress = styled(WalletName)`
  opacity: 0.5;
  font-weight: normal;
`;

export const WalletDisconnectButton = styled(Button)`
  font-size: 0.6em;
  padding: 0;
  color: ${COLORS.error};
  background: none;
  border: 0;
  margin-left: auto;
  text-align: right;
`;

export const Body = styled.div`
  font-family: ${FONTS.main};
  color: ${COLORS.white};
  font-size: ${SIZE.fontSize};
`;
