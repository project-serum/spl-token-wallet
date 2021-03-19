import React from 'react';
import styled from 'styled-components';
import { RowContainer, Title } from '../../commonStyles';

export const Stroke = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 0.2rem solid #383b45;
  width: 90%;
  height: 4rem;
`;

const ProgressBarContainer = styled.div`
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
`;

const Percent = styled.div`
  position: absolute;
  width: 0;
  height: 100%;
  border-bottom: 2px solid #4b81bd;
  z-index: 1;
  transition: width 1s;
`;

const ProgressBar = styled.div`
  position: absolute;
  width: 100%;
  height: 50%;
  border-bottom: 0.1rem solid transparent;
  border-image: ${(props) =>
    props.currentStep === 1
      ? 'linear-gradient(90deg,rgb(115, 128, 235),rgb(147, 160, 178) 36%,rgb(147, 160, 178))'
      : props.currentStep === 2
      ? 'linear-gradient(90deg, rgb(64, 110, 220), rgb(115, 128, 235) 51%, rgb(147, 160, 178) 90%)'
      : props.currentStep === 3
      ? '#366CE5'
      : '#93A0B2'};
  border-image-slice: 1;
  z-index: -1;
`;

const Step = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  background: ${(props) => (props.isCompleted ? '#406EDC' : '#17181a')};
  color: #fff;
  justify-content: center;
  align-items: center;
  font-size: 1.4rem;
  display: flex;
  border: ${(props) =>
    props.isSelected || props.isCompleted
      ? '0.1rem solid #406EDC'
      : '0.1rem solid #93A0B2'};
  border-radius: 50%;
  transition: background 1s;
`;

const Steps = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 40rem;
  height: 0.1rem;
  background: ${(props) => (props.isCompleted ? '#366CE5' : 'none')};
`;

const ProgressBarComponent = ({ currentStep }: { currentStep: number }) => {
  return (
    <RowContainer
      direction={'row'}
      justify={'flex-start'}
      align={'baseline'}
      margin={'0 0 7rem 0'}
    >
      <ProgressBarContainer>
        <ProgressBar currentStep={currentStep}>
          <Percent />
        </ProgressBar>

        <Steps isCompleted={currentStep === 3}>
          <div>
            {' '}
            <Step
              isCompleted={currentStep > 1}
              isSelected={currentStep === 1}
              id="1"
            >
              1
            </Step>
            <Title
              style={{
                position: 'absolute',
                width: '11rem',
                right: '33rem',
                top: '2.5rem',
                whiteSpace: 'nowrap',
              }}
            >
              Create Password
            </Title>
          </div>
          <div>
            <Step
              isCompleted={currentStep > 2}
              isSelected={currentStep === 2}
              id="2"
            >
              2
            </Step>
            <Title
              style={{
                position: 'absolute',
                width: '14rem',
                right: '13rem',
                top: '2.5rem',
                whiteSpace: 'nowrap',
              }}
            >
              Confirm Seed Phrase
            </Title>
          </div>
          <div>
            <Step isSelected={currentStep === 3} id="3">
              3
            </Step>
            <Title
              style={{
                position: 'absolute',
                width: '8rem',
                left: '34rem',
                top: '2.5rem',
                whiteSpace: 'nowrap',
              }}
            >
              Add Tokens
            </Title>
          </div>
        </Steps>
      </ProgressBarContainer>
    </RowContainer>
  );
};

export default ProgressBarComponent;
