import { useTheme } from '@material-ui/core';
import React, { useState } from 'react';
import { FeedbackPopup } from '../UsersFeedBackPopup/UsersFeedbackPopup';
import {
  DashboardLink,
  FeedbackBtn,
  StakingLink,
  SwapsLink,
  TradeLink,
  WalletLink,
} from './NavIconsComponent';
import { FooterComponent } from './styles';

export const MobileFooter = ({ pathname }) => {
  const [isFeedBackPopupOpen, setIsFeedBackPopupOpen] = useState(false);
  const theme = useTheme();
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
      <FeedbackBtn
        onClick={() => {
          setIsFeedBackPopupOpen(true);
        }}
        isActive={isFeedBackPopupOpen}
      />
      <FeedbackPopup
        theme={theme}
        open={isFeedBackPopupOpen}
        onClose={() => {
          setIsFeedBackPopupOpen(false);
        }}
      />
    </FooterComponent>
  );
};
