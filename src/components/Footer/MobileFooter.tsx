import React from 'react';
import {
  DashboardLink,
  StakingLink,
  SwapsLink,
  TradeLink,
  WalletLink,
} from './NavIconsComponent';
import { FooterComponent } from './styles';

export const MobileFooter = ({ pathname }) => {
  return (
    <FooterComponent height="11em" justify="space-around">
      <TradeLink isActive={false} />
      <DashboardLink isActive={false} />
      {/* <AnalyticsLink isActive={pathname.includes('analytics')} />
      <PoolsLink isActive={pathname.includes('pools')} /> */}
      <SwapsLink isActive={false} />
      {/* <RebalanceLink isActive={pathname.includes('rebalance')} /> */}
      <StakingLink isActive={false} />
      <WalletLink isActive={true} />
    </FooterComponent>
  );
};
