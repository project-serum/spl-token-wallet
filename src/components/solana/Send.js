import { Button, Row, Steps } from 'antd';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

import Step1 from './Step1';
import Step2 from './Step2';

const { Step } = Steps;

const Wrapper = styled.div`
  height: 100%;
  position: relative;
  padding: 31px 40px;
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
    height: 8px;
    border-radius: 7px;
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
  .ant-steps-item-content {
    display: block;
  }
  .ant-steps-item {
    .ant-steps-item-icon {
      left: 24px;
      width: 60px;
      height: 60px;
      margin-bottom: 12px;
      margin-right:0;
      .ant-steps-icon {
        font-size: 30px;
        top: 13px;
        left: -2px;
      }
     
    }
    &:last-child .ant-steps-item-icon{
      left:0;
    }
  }
  .ant-steps-item  {
    &:last-child .ant-steps-item-container {
      text-align:center;
    }
  }
  .ant-steps-item-title::after {
    top: -45px;
    left: 100px;
  }
`;
const ContentWrapper = styled.div`
  padding-top: 30px;
`;
const ButtonWrapper = styled(Row)`
  position: absolute;
  bottom: 37px;
  left: 50%;
  transform: translateX(-50%);
`;
const Send = () => {
  const [current, setCurrent] = useState(0);
  const HandleNext = useCallback(() => {
    setCurrent(1);
  }, []);
  const StepsList = [
    { content: <Step1 />, title: 'Send Tokens' },
    { content: <Step2 />, title: 'Confirm' },
  ];
  const RenderContent = StepsList[current].content;
  return (
    <Wrapper>
      <Steps current={current} style={{ width: 460, margin: '0 auto' }}>
        {StepsList.map((item, index) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <ContentWrapper>{RenderContent}</ContentWrapper>
      <ButtonWrapper>
        {current < 2 ? (
          <>
            <Button type="primary" ghost size="large" style={{ width: 200 }}>
              Cancel
            </Button>
            <Button
              type="primary"
              size="large"
              style={{ width: 200, marginLeft: 24 }}
              onClick={HandleNext}
            >
              Next
            </Button>
          </>
        ) : (
            <>
              <Button
                type="primary"
                ghost
                size="large"
                style={{ width: current > 0 ? 200 : 300 }}
              >
                Reject
            </Button>
              <Button
                type="primary"
                size="large"
                style={{ width: 200, marginLeft: 24 }}
                onClick={HandleNext}
              >
                Confirm
            </Button>
            </>
          )}
      </ButtonWrapper>
    </Wrapper>
  );
};
export default React.memo(Send);
