import React from 'react';
import styled from 'styled-components';
import { RowContainer } from '../../pages/commonStyles';
import { isExtension } from '../../utils/utils';
import Logo from '../../images/SunLogo.svg';

const LogoContainer = styled.div`
  width: ${(props) => props.width || '32rem'};
  height: ${(props) => props.width || 'auto'};
`;

const LogoComponent = ({
  width,
  height,
  margin,
}: {
  width?: string;
  height?: string;
  margin?: string;
}) => {
  return (
    <RowContainer height={'20%'}>
      <LogoContainer
        isExtension={isExtension}
        width={width}
        height={height}
        margin={margin}
      >
        <img src={Logo} alt="logo" width="100%" height="100%" />
      </LogoContainer>
    </RowContainer>
  );
};

export default LogoComponent;
