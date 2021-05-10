import React from 'react';
import styled from 'styled-components';
import { useTheme } from '@material-ui/core';
import { TableContainer, HeadRow, GreyTitle } from './AssetsTable';
import { RowContainer, Title } from '../../commonStyles';

const StyledActivityTable = styled(TableContainer)`
  width: calc(15% - 1rem);
  flex-direction: column;
  @media (max-width: 540px) {
    display: ${(props) => (props.isActive ? 'block' : 'none')};
  }
`;

const ActivityHeaderRow = styled(RowContainer)`
  height: 5rem;
  @media (max-width: 540px) {
    display: none;
  }
`;

const ComingSoonTitle = styled(Title)`
  @media (max-width: 540px) {
    font-size: 2rem;
    white-space: nowrap;
  }
`;

const ActivityTable = ({ isActive }: { isActive?: boolean }) => {
  const theme = useTheme();
  return (
    <StyledActivityTable isActive={isActive} theme={theme}>
      <ActivityHeaderRow>
        <HeadRow
          theme={theme}
          justify="flex-start"
          style={{ width: '100%', padding: '1.4rem 0 1.4rem 2.4rem' }}
        >
          <GreyTitle theme={theme}>Activity</GreyTitle>
        </HeadRow>
      </ActivityHeaderRow>
      <RowContainer height="100%">
        <ComingSoonTitle>Coming Soon</ComingSoonTitle>
      </RowContainer>
    </StyledActivityTable>
  );
};

export default ActivityTable;
