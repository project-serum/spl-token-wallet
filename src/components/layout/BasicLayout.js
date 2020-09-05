import * as React from 'react';
import { hideHeaderLogo } from '../../config/whiteList';
import imageMapping from '../../modules/shared/imageMapping';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
const LayoutWrapper = styled.div`
  background: url(${({ theme }) =>
      theme.mode === 'dark'
        ? imageMapping.solanaBg
        : imageMapping.solanaBgLight})
    no-repeat;
  background-size: cover;
  height: 100vh;
`;
const Wrapper = styled.div`
  position: relative;
  padding: 0 100px;
  height: 100vh;
`;
const ContentWrapper = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: calc(100% - 200px);
  min-width: 1440px;
  background-color: #232429;
  border-radius: 20px;
  overflow: hidden;
  height: 787px;
  background: ;
  background: ${({ theme }) =>
    theme.mode === 'dark'
      ? `
    url(${imageMapping.contentBg}) right top no-repeat;
`
      : 'linear-gradient(45deg,#3602B0, #9854FE)'};
  background-size: cover;
`;
const Header = styled.div`
  padding-left: 28px;
  height: 109px;
  line-height: 109px;
`;
const BasicLayout = (props) => {
  const hideLogo = hideHeaderLogo.includes(props.location.pathname);
  return (
    <LayoutWrapper>
      <Wrapper>
        <ContentWrapper>
          <Header>
            {!hideLogo && <img src={imageMapping.headerLogo} alt="" />}
          </Header>
          {props.children}
        </ContentWrapper>
      </Wrapper>
    </LayoutWrapper>
  );
};

export default withRouter(BasicLayout);
