import React from 'react';
import { useTheme } from '@material-ui/core';
import { TableContainer, HeadRow, GreyTitle } from './AssetsTable';
import { RowContainer, Title } from '../../commonStyles';

const ActivityTable = () => {
  const theme = useTheme();
  return (
    <TableContainer
      theme={theme}
      width="calc(15% - 1rem)"
      direction="column"
    >
      <RowContainer height="5rem">
        <HeadRow
          theme={theme}
          justify="flex-start"
          style={{ width: '100%', padding: '1.4rem 0 1.4rem 2.4rem' }}
        >
          <GreyTitle theme={theme}>Activity</GreyTitle>
        </HeadRow>
      </RowContainer>
      <RowContainer height="100%">
        <Title>
          Coming Soon
        </Title>
      </RowContainer>
    </TableContainer>
  );
};

export default ActivityTable;
