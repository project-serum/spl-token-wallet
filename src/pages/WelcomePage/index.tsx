import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';
import {
  // extensionUrl,
  isExtension,
  openExtensionInNewTab,
} from '../../utils/utils';
import {
  Row,
  Body,
  Img,
  Title,
  CardButton,
  BoldTitle,
  RowContainer,
} from '../commonStyles';
import Logo from '../../components/Logo';

// import Import from '../../images/ImportButton.svg';

const StyledContainer = styled(Row)`
  @media (max-width: 620px) {
    flex-direction: column;
  }
`;

const StyledCardButton = styled(CardButton)`
  justify-content: spase-between;
  flex-direction: column;
  align-items: ${(props) => (props.isExtension ? 'center' : 'flex-start')};
  padding: 0 3rem;
  @media (max-width: 620px) {
    width: 25rem;
    height: 25rem;
  }
  @media (max-width: 540px) {
    width: 30rem;
    height: ${(props) => (props.isRestoreBtn ? '14rem' : '30rem')};
  }
`;

const CreateWalletButton = styled(StyledCardButton)`
  margin: 0 2rem 0 0;

  @media (max-width: 620px) {
    margin: 0 0 2rem 0;
  }
  @media (max-width: 540px) {
    align-items: center;
  }
`;
const StyledButton = styled(Row)`
  justify-content: space-around;
  flex-direction: column;
  align-items: flex-start;
  height: 100%;
  @media (max-width: 540px) {
    flex-direction: row;
    justify-content: space-between;
    width: 85%;
    align-items: center;
  }
`;

const StyledIcon = styled(Img)`
  width: 12rem;
  height: 12rem;
  display: flex;
  justify-content: flex-start;
  @media (max-width: 540px) {
    width: 9rem;
    height: 9rem;
    margin-right: 2rem;
  }
`;

const RestoreTitle = styled(RowContainer)`
  flex-direction: column;
  align-items: flex-start;
  @media (max-width: 540px) {
    width: 60%;
    align-items: flex-start;
  }
`;

const ButtonCardsContainer = styled(Row)`
  @media (max-width: 540px) {
    flex-direction: column;
  }
`;

const StyledButtonContainer = styled.a`
  margin: 0 0 0 2rem;
  @media (max-width: 540px) {
    margin: 2rem 0 0 0;
  }
`;

const CreateWalletButtonInner = () => (
  <CreateWalletButton width="35rem" height="35rem">
    <Row direction={'column'} justify={'space-around'} height={'100%'}>
      <Img width="12rem" height="12rem">
        <img
          src={
            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzEiIGhlaWdodD0iNzIiIHZpZXdCb3g9IjAgMCA3MSA3MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMzUuNzVIMzUuMzk3Nk0zNS4zOTc2IDM1Ljc1SDcwLjc5NTJNMzUuMzk3NiAzNS43NVYwLjM1MjQxN00zNS4zOTc2IDM1Ljc1VjcxLjE0NzYiIHN0cm9rZT0iIzM2NkNFNSIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjwvc3ZnPgo='
          }
          alt={'plus, add'}
          width="100%"
          height="100%"
        />
      </Img>
      <BoldTitle>Create New Wallet</BoldTitle>
    </Row>
  </CreateWalletButton>
);

export const WelcomePage = () => {
  const hash = sessionStorage.getItem('hash');

  return (
    <Body>
      <Helmet>
        <title>CCAI Wallet | Wallet made by Cryptocurrencies.Ai</title>
      </Helmet>
      {isExtension && <Logo />}
      <RowContainer height={'80%'} direction={'column'}>
        <StyledContainer>
          <ButtonCardsContainer>
            <ButtonCardsContainer>
              {window.opener ? (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={'https://wallet.cryptocurrencies.ai/create_wallet'}
                  onClick={() => {
                    window.close();
                  }}
                >
                  <CreateWalletButtonInner />
                </a>
              ) : isExtension && hash !== '#from_extension' ? (
                <div onClick={openExtensionInNewTab}>
                  <CreateWalletButtonInner />
                </div>
              ) : (
                <Link to={'/create_wallet'}>
                  <CreateWalletButtonInner />
                </Link>
              )}{' '}
              <Link to={'/restore_wallet'}>
                <StyledCardButton
                  isExtension={isExtension}
                  width="35rem"
                  height="35rem"
                  isRestoreBtn
                >
                  <StyledButton isExtension={isExtension}>
                    <StyledIcon>
                      <img
                        src={
                          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTQiIGhlaWdodD0iNDQiIHZpZXdCb3g9IjAgMCA1NCA0NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTUuMTM1NDYgMTcuNTI1MUM1LjQxMzAxIDE4LjAwMjYgNi4wMjUwOCAxOC4xNjQ3IDYuNTAyNTYgMTcuODg3MUwxNC4yODM1IDEzLjM2NDNDMTQuNzYxIDEzLjA4NjcgMTQuOTIzMSAxMi40NzQ3IDE0LjY0NTYgMTEuOTk3MkMxNC4zNjggMTEuNTE5NyAxMy43NTU5IDExLjM1NzYgMTMuMjc4NSAxMS42MzUyTDYuMzYyMDMgMTUuNjU1NUwyLjM0MTcyIDguNzM5MDZDMi4wNjQxNyA4LjI2MTU4IDEuNDUyMSA4LjA5OTUgMC45NzQ2MjIgOC4zNzcwNUMwLjQ5NzE0MiA4LjY1NDU5IDAuMzM1MDYzIDkuMjY2NjYgMC42MTI2MDcgOS43NDQxNEw1LjEzNTQ2IDE3LjUyNTFaTTE0Ljc2NjggNC42NDMyN0wxNC4yMDY3IDMuODE0ODVMMTQuNzY2OCA0LjY0MzI3Wk0yOS40MjQ2IDEuMTg0OTlMMjkuMjkyNSAyLjE3NjI0TDI5LjQyNDYgMS4xODQ5OVpNNDIuNjk4MyA4LjM2NDE3TDQzLjQ1NCA3LjcwOTIzTDQyLjY5ODMgOC4zNjQxN1pNNDguODY0NSAyNi40NzQ5QzQ4LjU4NyAyNS45OTc0IDQ3Ljk3NDkgMjUuODM1MyA0Ny40OTc0IDI2LjExMjlMMzkuNzE2NSAzMC42MzU3QzM5LjIzOSAzMC45MTMzIDM5LjA3NjkgMzEuNTI1MyAzOS4zNTQ0IDMyLjAwMjhDMzkuNjMyIDMyLjQ4MDMgNDAuMjQ0MSAzMi42NDI0IDQwLjcyMTUgMzIuMzY0OEw0Ny42MzggMjguMzQ0NUw1MS42NTgzIDM1LjI2MDlDNTEuOTM1OCAzNS43Mzg0IDUyLjU0NzkgMzUuOTAwNSA1My4wMjU0IDM1LjYyM0M1My41MDI5IDM1LjM0NTQgNTMuNjY0OSAzNC43MzMzIDUzLjM4NzQgMzQuMjU1OUw0OC44NjQ1IDI2LjQ3NDlaTTM5LjIzMzIgMzkuMzU2N0wzOC42NzMgMzguNTI4M0wzOS4yMzMyIDM5LjM1NjdaTTI0LjU3NTQgNDIuODE1TDI0LjcwNzUgNDEuODIzOEgyNC43MDc1TDI0LjU3NTQgNDIuODE1Wk0xMS4zMDE3IDM1LjYzNThMMTAuNTQ2IDM2LjI5MDhMMTEuMzAxNyAzNS42MzU4Wk02Ljk2NjcgMTcuMjc4NkM4LjI0NjggMTIuNDQ0NSAxMS4yMTkzIDguMjQ4OTQgMTUuMzI2OSA1LjQ3MTY5TDE0LjIwNjcgMy44MTQ4NUM5LjY5NTI5IDYuODY1MDkgNi40MzYxOSAxMS40Njg5IDUuMDMzMzQgMTYuNzY2Nkw2Ljk2NjcgMTcuMjc4NlpNMTUuMzI2OSA1LjQ3MTY5QzE5LjQzNDMgMi42OTQ2NiAyNC4zOTc2IDEuNTI0MTYgMjkuMjkyNSAyLjE3NjI0TDI5LjU1NjYgMC4xOTM3NTFDMjQuMTc0MSAtMC41MjMyODYgMTguNzE4NSAwLjc2NDM5NSAxNC4yMDY3IDMuODE0ODVMMTUuMzI2OSA1LjQ3MTY5Wk0yOS4yOTI1IDIuMTc2MjRDMzQuMTg3NiAyLjgyODMzIDM4LjY4MzkgNS4yNTkxNCA0MS45NDI2IDkuMDE5MTFMNDMuNDU0IDcuNzA5MjNDMzkuODc3OCAzLjU4MyAzNC45MzkxIDAuOTEwNzczIDI5LjU1NjYgMC4xOTM3NTFMMjkuMjkyNSAyLjE3NjI0Wk00MS45NDI2IDkuMDE5MTFDNDUuMjAxNiAxMi43Nzk0IDQ3IDE3LjYxMjMgNDcgMjIuNjE3Nkg0OUM0OSAxNy4xMzM4IDQ3LjAyOTkgMTEuODM1MiA0My40NTQgNy43MDkyM0w0MS45NDI2IDkuMDE5MTFaTTQ3LjAzMzMgMjYuNzIxNEM0NS43NTMyIDMxLjU1NTUgNDIuNzgwNyAzNS43NTExIDM4LjY3MyAzOC41MjgzTDM5Ljc5MzMgNDAuMTg1MkM0NC4zMDQ3IDM3LjEzNDkgNDcuNTYzOCAzMi41MzExIDQ4Ljk2NjcgMjcuMjMzNEw0Ny4wMzMzIDI2LjcyMTRaTTM4LjY3MyAzOC41MjgzQzM0LjU2NTcgNDEuMzA1MyAyOS42MDI0IDQyLjQ3NTggMjQuNzA3NSA0MS44MjM4TDI0LjQ0MzQgNDMuODA2MkMyOS44MjU5IDQ0LjUyMzMgMzUuMjgxNSA0My4yMzU2IDM5Ljc5MzMgNDAuMTg1MkwzOC42NzMgMzguNTI4M1pNMjQuNzA3NSA0MS44MjM4QzE5LjgxMjQgNDEuMTcxNyAxNS4zMTYxIDM4Ljc0MDkgMTIuMDU3NCAzNC45ODA5TDEwLjU0NiAzNi4yOTA4QzE0LjEyMjIgNDAuNDE3IDE5LjA2MDkgNDMuMDg5MiAyNC40NDM0IDQzLjgwNjJMMjQuNzA3NSA0MS44MjM4Wk0xMi4wNTc0IDM0Ljk4MDlDOC43OTgzOSAzMS4yMjA2IDcgMjYuMzg3NyA3IDIxLjM4MjRINUM1IDI2Ljg2NjIgNi45NzAxMSAzMi4xNjQ4IDEwLjU0NiAzNi4yOTA4TDEyLjA1NzQgMzQuOTgwOVoiIGZpbGw9IiM0MDZFREMiLz4KPC9zdmc+Cg=='
                        }
                        alt={'restore'}
                        width="100%"
                        height="100%"
                      />
                    </StyledIcon>
                    <RestoreTitle
                      style={{ marginLeft: isExtension ? '2rem' : '0' }}
                    >
                      <BoldTitle>Restore Existing Wallet </BoldTitle>
                      <Title style={{ textAlign: 'start' }}>
                        by seed phrase
                      </Title>
                    </RestoreTitle>
                  </StyledButton>
                </StyledCardButton>
              </Link>
            </ButtonCardsContainer>

            {!isExtension && (
              <Row>
                <StyledButtonContainer
                  href={'/restore_wallet'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <StyledCardButton
                    isExtension={isExtension}
                    width="35rem"
                    height="35rem"
                    isRestoreBtn
                  >
                    <StyledButton isExtension={isExtension}>
                      <StyledIcon>
                        <img
                          src={
                            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMjMuOTQ2MyAzMi44MjczQzIxLjY1OTMgMzIuODIzNiAxOS40NjcxIDMxLjkxMzQgMTcuODUwMiAzMC4yOTZDMTYuMjMzMiAyOC42Nzg3IDE1LjMyMzUgMjYuNDg2MyAxNS4zMjAzIDI0LjE5OTNDMTUuMzIzIDIxLjkxMTcgMTYuMjMyOCAxOS43MTg0IDE3Ljg1MDIgMTguMTAwNkMxOS40Njc2IDE2LjQ4MjggMjEuNjYwNyAxNS41NzI1IDIzLjk0ODMgMTUuNTY5M0MyNi4yMzYzIDE1LjU3MiAyOC40Mjk5IDE2LjQ4MjEgMzAuMDQ3NyAxOC4wOTk5QzMxLjY2NTYgMTkuNzE3OCAzMi41NzU3IDIxLjkxMTMgMzIuNTc4MyAyNC4xOTkzQzMyLjU3NTEgMjYuNDg3IDMxLjY2NDggMjguNjggMzAuMDQ3IDMwLjI5NzVDMjguNDI5MiAzMS45MTQ5IDI2LjIzNiAzMi44MjQ3IDIzLjk0ODMgMzIuODI3M0gyMy45NDYzWiIgZmlsbD0iIzQyODVGNCIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTI3LjU4MDkgMzQuMzYxNUMyNS43ODExIDM1LjAxNDcgMjMuODQyMSAzNS4xODc0IDIxLjk1NTIgMzQuODYyN0MyMC4wNjgzIDM0LjUzNzkgMTguMjk4NyAzMy43MjY4IDE2LjgyMDkgMzIuNTA5NUMxNS4yMjc2IDMxLjE5NTUgMTQuMDM2OCAyOS40NTkyIDEzLjM4NDkgMjcuNDk5NUwxMy4zODA5IDI3LjQ4NzVMMy44NzA4NyAxMS4wMTk1QzAuNDYwNDQxIDE2LjIzOCAtMC43NjQ3OTYgMjIuNTg2OCAwLjQ1ODg3NSAyOC42OTk1QzEuMDU5NzggMzEuNzg3NiAyLjI2NzE0IDM0LjcyNTggNC4wMTExIDM3LjM0NDFDNS43NTUwNSAzOS45NjI1IDguMDAwOTcgNDIuMjA4OSAxMC42MTg5IDQzLjk1MzVDMTMuMzY3NiA0NS44MDEzIDE2LjQ3MTggNDcuMDU0NyAxOS43MzI5IDQ3LjYzMzVMMjcuNTgwOSAzNC4zNjM1VjM0LjM2MTVaIiBmaWxsPSIjNEFBRTQ4Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNDUuNTE4NCAxMy40MTM3QzQzLjcxOTUgOS43OTQ2MSA0MS4wNDEzIDYuNjg0NjUgMzcuNzI5MyA0LjM2ODU2QzM0LjQxNzIgMi4wNTI0NyAzMC41NzcxIDAuNjA0MjY1IDI2LjU2MDQgMC4xNTY1MzNDMjIuNTQzNyAtMC4yOTEyIDE4LjQ3ODkgMC4yNzU4NTEgMTQuNzM4MiAxLjgwNTc3QzEwLjk5NzQgMy4zMzU2OCA3LjcwMDE4IDUuNzc5NTcgNS4xNDg0NCA4LjkxMzY4TDEzLjE4MDQgMjIuODI1N0MxMy41MTEgMjAuMjQ5OCAxNC43NTk4IDE3Ljg3OTcgMTYuNjk3NSAxNi4xNTA3QzE4LjYzNTIgMTQuNDIxNyAyMS4xMzE3IDEzLjQ0OTkgMjMuNzI4NCAxMy40MTM3SDQ1LjUxODRaIiBmaWxsPSIjRUEzOTM5Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMjMuODUyNyA0Ny45OTkzQzI5Ljg3MjcgNDcuOTk5MyAzNS42MzQ3IDQ1Ljc0MTMgNDAuMDcyNyA0MS42NDMzQzQ0LjUyNzcgMzcuNTQwNCA0Ny4yNTYgMzEuODk3MiA0Ny43MDQ3IDI1Ljg1NzNDNDcuOTYzIDIyLjM2MDYgNDcuNDU1MiAxOC44NDk2IDQ2LjIxNjcgMTUuNTY5M0gzMC41MDQ3QzMxLjgxMzcgMTYuNjA0OCAzMi44NzAxIDE3LjkyNDIgMzMuNTk0MyAxOS40MjhDMzQuMzE4NCAyMC45MzE3IDM0LjY5MTMgMjIuNTgwMyAzNC42ODQ3IDI0LjI0OTNDMzQuNjY4OCAyNi43MDMyIDMzLjgzNzEgMjkuMDgyMSAzMi4zMjA3IDMxLjAxMTNMMjIuMzA0NyA0Ny45NTEzQzIyLjgyMDcgNDcuOTgzMyAyMy4zNDA3IDQ3Ljk5OTMgMjMuODUyNyA0Ny45OTkzWiIgZmlsbD0iI0ZFRDE0QiIvPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSJ3aGl0ZSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM+Cjwvc3ZnPgo='
                          }
                          alt={'restore'}
                          width="100%"
                          height="100%"
                        />
                      </StyledIcon>
                      <RestoreTitle>
                        <BoldTitle>Instal Extension</BoldTitle>
                        <Title mediaTextAlign={'left'}>
                          for chrome-based browsers
                        </Title>
                      </RestoreTitle>
                    </StyledButton>
                  </StyledCardButton>
                </StyledButtonContainer>
              </Row>
            )}
          </ButtonCardsContainer>

          {/* <Row direction={'column'} justify={'space-between'} height={'100%'}> */}

          {/* <a href={'/import_wallet'}>
            <CardButton width="35rem" height="16.5rem">
              <Row width={'80%'} justify={'space-between'}>
                {' '}
                <Img width="9rem" height="9rem">
                  {' '}
                  <img src={Import} width="100%" height="100%" alt={'import'} />
                </Img>
                <Row
                  direction={'column'}
                  justify={'center'}
                  align={'end'}
                  width={'60%'}
                >
                  {' '}
                  <BoldTitle>Import Wallet</BoldTitle>
                  <Title>using private key</Title>{' '}
                </Row>
              </Row>
            </CardButton>
          </a> */}
          {/* </Row> */}
        </StyledContainer>
      </RowContainer>
    </Body>
  );
};
