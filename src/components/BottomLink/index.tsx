import React from 'react';
import { Link } from 'react-router-dom';

import { Title, RowContainer } from '../../pages/commonStyles';
import { useTheme } from '@material-ui/core';

const BottomLink = ({
  to = '/restore_wallet',
  toText = 'Restore Existing Wallet',
  needOr = true,
  linkColor = null,
}) => {
  const theme = useTheme();

  return (
    <RowContainer margin={'1rem 0 0 0'}>
      <Title color={theme.customPalette.grey.dark} fontSize={'1.4rem'}>
        {needOr ? <span>Or </span> : null}
        <Link
          to={to}
          style={{
            color: linkColor || theme.customPalette.blue.new,
            textDecoration: 'none',
          }}
        >
          {toText}
        </Link>
      </Title>
    </RowContainer>
  );
};

export default BottomLink;
