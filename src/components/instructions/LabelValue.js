import React from 'react';
import Link from '@material-ui/core/Link';
import { Title } from '../../pages/commonStyles';
import { useTheme } from '@material-ui/core';

export default function LabelValue({ label, value, link = false, onClick }) {
  const theme = useTheme()

  return (
    <Title fontSize="1.6rem">
      {label}:{' '}
      {link ? (
        <Link style={{ fontSize: '1.6rem', color: theme.customPalette.blue.serum }} href="#" onClick={onClick}>
          {value}
        </Link>
      ) : (
        <Title style={{ color: '#7B7B7B' }}>{value}</Title>
      )}
    </Title>
  );
}
