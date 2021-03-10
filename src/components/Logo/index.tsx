import React from 'react'
import styled from 'styled-components'
import Logo from '../../images/logo.svg';

const LogoContainer = styled.div`
  width: ${(props) => props.width || '30rem'};
  height: ${(props) => props.width || '10rem'};
  margin: ${props => props.margin || '0 0 8rem 0'};
`

export default ({ width, height, margin }: { width?: string, height?: string, margin?: string }) => {
  return (
    <LogoContainer width={width} height={height} margin={margin}>
      <img src={Logo} width="100%" height="100%" />
    </LogoContainer>
  );
};
