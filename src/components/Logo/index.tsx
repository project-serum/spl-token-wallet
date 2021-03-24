import React from 'react'
import styled from 'styled-components'
import Logo from '../../images/logo.png';

const LogoContainer = styled.div`
  width: ${(props) => props.width || '30rem'};
  height: ${(props) => props.width || 'auto'};
  margin: ${props => props.margin || '0 0 8rem 0'};
`

const LogoComponent = ({ width, height, margin }: { width?: string, height?: string, margin?: string }) => {
  return (
    <LogoContainer width={width} height={height} margin={margin}>
      <img src={Logo} alt="logo" width="100%" height="100%" />
    </LogoContainer>
  );
};


export default LogoComponent