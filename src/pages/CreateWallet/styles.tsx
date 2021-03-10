import styled from 'styled-components';

export const ProgressBarContainer = styled.div`
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
`;

export const Percent = styled.div`
  position: absolute;
  width: 0;
  height: 100%;
  border-bottom: 2px solid #4b81bd;
  z-index: 1;
  transition: width 1s;
`;

export const ProgressBar = styled.div`
  position: absolute;
  width: 100%;
  height: 50%;
  border-bottom: 2px solid transparent;
  border-image: ${(props) =>
    props.currentStep === '1'
      ? 'linear-gradient(90deg,rgb(115, 128, 235),rgb(147, 160, 178) 36%,rgb(147, 160, 178))'
      : props.currentStep === '2'
      ? 'linear-gradient(90deg, rgb(64, 110, 220), rgb(115, 128, 235) 51%, rgb(147, 160, 178) 90%)'
      : props.currentStep === '3'
      ? '#406EDC'
      : '#93A0B2'};
  border-image-slice: 1;
  z-index: -1;
`;

export const Step = styled.div`
  width: 3rem;
  height: 3rem;
  background: ${(props) => (props.isCompleted ? '#406EDC' : '#17181a')};
  color: #fff;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  display: flex;
  border: ${(props) =>
    props.isSelected || props.isCompleted
      ? '0.1rem solid #406EDC'
      : '0.1rem solid #93A0B2'};
  border-radius: 50%;
  transition: background 1s;
`;

export const Steps = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 40rem;
  height: 0.1rem;
  background: ${(props) => (props.isCompleted ? '#7380EB' : 'none')};
`;

export const ColorText = styled.div`
  width: ${(props) => props.width || '90%'};
  height: ${(props) => props.height || '4.5rem'};
  margin: ${(props) => props.margin || '0'};
  font-size: 1.2rem;
  font-family: Avenir Next Medium;
  display: flex;
  color: #fff;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background: ${(props) => props.background || '#383b45'};
  border-radius: ${(props) => props.radius || '1.5rem'};
  display: flex;
  justify-content: ${(props) => props.justify || 'space-evenly'};
  flex-direction: ${(props) => props.direction || 'row'};
  align-items: ${(props) => props.align || 'center'};
`;

export const Textarea = styled.textarea`
  width: ${(props) => props.width || '90%'};
  height: ${(props) => props.height || '5rem'};
  font-family: Avenir Next Medium;
  border: 1px solid #3a475c;
  font-size: 1.4rem;
  letter-spacing: -0.457692px;
  color: #f8faff;
  border-radius: 1.5rem;
  background: #222429;
  outline: none;
  padding: 1rem 8rem 1rem 2rem;
  margin-bottom: 2rem;
  position: relative;
`;

export const ContainerForIcon = styled.div`
  cursor: pointer;
  width: 5rem;
  height: 3.5rem;
  border-radius: 1.5rem;
  position: absolute;
  right: 5rem;
  top: 2.5rem;
  border: 0.2rem solid #3a475c;
  display: flex;
  justify-content: center;
  align-items: center;
`;
