import { CaretRightFilled } from '@ant-design/icons';
import { Button, Col, Row, Steps } from 'antd';
import { withRouter } from 'react-router-dom';
import React, { useCallback, useState } from 'react';
import Step1 from '../components/newAccount/Step1';
import Step2 from '../components/newAccount/Step2';
import imageMapping from '../modules/shared/imageMapping';
import styled from 'styled-components';
const { Step } = Steps;

const Wrapper = styled(Row)`
  position: relative;
  .ant-steps-item-finish .ant-steps-item-icon {
    border-color: #3e5af2;
  }
  .ant-steps-item-finish .ant-steps-item-icon > .ant-steps-icon {
    color: #3e5af2;
  }
  .ant-steps-item-process .ant-steps-item-icon {
    background: #3e5af2;
    border-color: #3e5af2;
  }
  .ant-steps-item-title::after {
    background: #3e5af2;
    height: 2px;
    border-radius: 1px;
    top: 14px;
  }
  .ant-steps-item-content > .ant-steps-item-title::after {
    background-color: #3e5af2;
  }
  .ant-steps-item-finish
    > .ant-steps-item-container
    > .ant-steps-item-content
    > .ant-steps-item-title::after {
    background-color: #3e5af2;
  }
`;
const ContentWrapper = styled.div`
  padding-top: 36px;
`;
const StepWrapper = styled(Col)`
  border-radius: 20px;
  background-color: #34363f;
  height: 678px;
  padding: 32px 49px;
`;
const ButtonWrapper = styled(Row)`
  position: absolute;
  bottom: 37px;
`;
const Tip = styled(Col)`
  padding: 34px 40px;
  width: 528px;
  font-size: 16px;
  position: relative;
  background: #2b2c33;
  border-radius: 20px;
`;
const Title = styled.h1`
  font-size: 30px;
`;
const TipWrapper = styled.div`
  border-radius: 6px;
  background-color: #2b2c34;
  padding: 40px 24px;
`;
const TipTitle = styled.h2`
  font-size: 22px;
  color: #e6ac71;
`;
const TipContent = styled.ul`
  margin-bottom: 0;
  li {
    margin-bottom: 12px;
    list-style: none;
    &:last-child {
      margin-bottom: 0;
    }
    &:before {
      content: '';
      display: inline-block;
      vertical-align: middle;
      margin-right: 8px;
      width: 6px;
      height: 6px;
      background: #e6ac71;
      border-radius: 50%;
    }
  }
`;
const Send = (props) => {
  const [current, setCurrent] = useState(0);
  const [isDisabled, setIsDisabled] = useState(true);
  const [disableConfirmBtn, setDisableConfirmBtn] = useState(true);
  const [isDone, setIsDone] = useState(false);
  const handleNext = useCallback(() => {
    setCurrent(1);
  }, []);
  const openLock = useCallback(() => {
    setIsDisabled(false);
  }, []);
  const setConfirmBtn = useCallback((b) => {
    setDisableConfirmBtn(b);
  }, []);
  const setAllDone = useCallback(() => {
    setIsDone(true);
  }, []);
  const toWelcome = useCallback(() => {
    props.history.push('/setPassword?status=success');
  }, [props.history]);
  const StepsList = [
    {
      content: <Step1 openLock={openLock} isDisabled={isDisabled} />,
      title: 'step1',
    },
    { content: <Step2 setConfirmBtn={setConfirmBtn} />, title: 'step2' },
  ];
  const RenderContent = StepsList[current].content;
  return (
    <Wrapper>
      {isDone ? (
        <>
          <StepWrapper style={{ width: 'calc(100% - 528px)' }}>
            <ContentWrapper>
              <Title>Congratulations</Title>
              <div style={{ margin: '20px 0 40px' }}>
                Phrase Please select each phrase in orderto make sureitiscorect.
              </div>
              <TipWrapper>
                <TipTitle>Tips on storing it safely</TipTitle>
                <TipContent>
                  <li>Save a backup in multiple places.</li>
                  <li>Never share the phrase with anyone.</li>
                  <li>
                    Be careful of phishing! MetaMask will never spontaneously
                    ask for your seed phrase.
                  </li>
                  <li>
                    {
                      'If you need to back up your seed phrase again, you can find it in Settings->Security.'
                    }
                  </li>
                  <li>
                    If you ever have questions or see something fishy,
                    emailsupport@metamask.io.
                  </li>
                </TipContent>
              </TipWrapper>
            </ContentWrapper>
            <ButtonWrapper
              align="middle"
              justify="space-between"
              style={{ width: 'calc(100% - 98px)' }}
            >
              <Button
                type="primary"
                size="large"
                style={{
                  width: 240,
                  height: 52,
                  borderRadius: 6,
                }}
                onClick={toWelcome}
              >
                All Done
              </Button>
              <div style={{ display: 'inherit' }}>
                {'*MetaMask cannot recover your seedphrase.'}
                <a style={{ marginLeft: 8, color: '#6099ff' }} href="#">
                  Learn more
                  <CaretRightFilled style={{ verticalAlign: 'middle' }} />
                </a>
              </div>
            </ButtonWrapper>
          </StepWrapper>
          <Tip>
            <img
              src={imageMapping.allDone}
              style={{ position: 'relative', left: -66 }}
              alt=""
            />
          </Tip>
        </>
      ) : (
        <>
          <StepWrapper
            style={{ width: current === 0 ? 'calc(100% - 528px)' : '100%' }}
          >
            <Steps current={current} style={{ width: 200 }}>
              {StepsList.map((item) => (
                <Step key={item.title} />
              ))}
            </Steps>
            <ContentWrapper>{RenderContent}</ContentWrapper>
            <ButtonWrapper>
              {current === 0 ? (
                <>
                  <Button
                    type="primary"
                    ghost
                    size="large"
                    style={{
                      width: 240,
                      height: 52,
                      borderRadius: 6,
                      marginRight: 20,
                    }}
                    onClick={handleNext}
                  >
                    Remind me late
                  </Button>
                  <Button
                    type="primary"
                    disabled={isDisabled}
                    size="large"
                    style={{
                      width: 240,
                      height: 52,
                      borderRadius: 6,
                    }}
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                </>
              ) : (
                <Button
                  type="primary"
                  disabled={disableConfirmBtn}
                  size="large"
                  style={{
                    width: 240,
                    height: 52,
                    borderRadius: 6,
                  }}
                  onClick={setAllDone}
                >
                  Confirm
                </Button>
              )}
            </ButtonWrapper>
          </StepWrapper>
          {current === 0 && (
            <Tip>
              <h3>tips</h3>
              <div style={{ margin: '32px 0 20px' }}>
                Store this phrase in a password manager like 1Password.
              </div>
              <p style={{ marginBottom: 20 }}>
                Write this phrase on a piece of paper and store in a secure
                location. If you want even more security,write it down on
                multiple pieces of paper and store each in 2-3 different
                locations.
              </p>
              <div>Memorize this phrase.</div>
              <img src={imageMapping.processMan} alt="" />
            </Tip>
          )}
        </>
      )}
    </Wrapper>
  );
};
export default withRouter(React.memo(Send));
