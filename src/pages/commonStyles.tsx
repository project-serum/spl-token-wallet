import styled from 'styled-components';
import { BtnCustom } from '../components/BtnCustom';
import { Grid } from '@material-ui/core';

export type RowProps = {
  wrap?: string;
  justify?: string;
  direction?: string;
  align?: string;
  width?: string;
  height?: string;
  margin?: string;
  padding?: string;
  mediaDirection?: string;
  mediaJustify?: string;
  mediaMargin?: string;
};

export const Row = styled.div`
  display: flex;
  flex-wrap: ${(props: RowProps) => props.wrap || 'wrap'};
  justify-content: ${(props: RowProps) => props.justify || 'center'};
  flex-direction: ${(props: RowProps) => props.direction || 'row'};
  align-items: ${(props: RowProps) => props.align || 'center'};
  width: ${(props: RowProps) => props.width || 'auto'};
  height: ${(props: RowProps) => props.height || 'auto'};
  margin: ${(props: RowProps) => props.margin || '0'};
  padding: ${(props: RowProps) => props.padding || '0'};
`;

export const RowContainer = styled((props) => <Row {...props} />)`
  width: 100%;
`;

export const GridContainer = styled(({ ...rest }) => <Grid {...rest} />)`
  display: flex;
  flex: auto;
  align-items: center;
  width: calc(100%);
  height: 6rem;
  position: relative;
  padding: 0rem 3rem;
  margin: 0rem;
  border-bottom: ${(props) => props.theme.customPalette.border.new};
  background: ${(props) => props.theme.customPalette.dark.background};
`;

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
      ? '#366CE5'
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
  background: ${(props) => (props.isCompleted ? '#366CE5' : 'none')};
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
  font-size: 1.5rem;
  letter-spacing: -0.457692px;
  color: #f8faff;
  border-radius: 1.5rem;
  background: #222429;
  outline: none;
  padding: ${(props) => props.padding || '1rem 8rem 1rem 2rem'};
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

export const Img = styled.div`
  width: ${(props) => props.width || '30rem'};
  height: ${(props) => props.width || '10rem'};
`;

export const Card = styled.div`
  width: ${(props) => props.width || '50rem'};
  height: ${(props) => props.width || '40rem'};
  background: #222429;
  border: 0.1rem solid #3a475c;
  box-shadow: 0px 0px 16px rgba(125, 125, 131, 0.1);
  border-radius: 2rem;
  display: flex;
  justify-content: ${(props) => props.justify || 'center'};
  flex-direction: column;
  align-items: center;
`;

export const Input = styled.input`
  width: ${(props) => props.width || '90%'};
  height: ${(props) => props.height || '5rem'};
  color: #fff;
  font-family: Avenir Next Medium;
  border: 1px solid #3a475c;
  box-sizing: border-box;
  font-size: 1.5rem;
  border-radius: 1.5rem;
  background: #222429;
  outline: none;
  padding-left: 2rem;
  margin-bottom: 2rem;
`;
export const Body = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

export const TextButton = styled.button`
  font-family: Avenir Next Medium;
  font-style: normal;
  font-weight: 500;
  font-size: 1.2rem;
  text-align: center;
  letter-spacing: -0.457692px;
  color: ${(props) => props.color || '#f79894'};
  border: none;
  background-color: #222429;
  backgroung: #222429;
  width: ${(props) => props.width || '50%'};
  outline: none;
  cursor: pointer;
`;

export const Title = styled.span`
  width: ${(props) => props.width || 'auto'};
  font-family: ${(props) => props.fontFamily || 'Avenir Next Medium'};
  font-style: normal;
  font-weight: normal;
  font-size: ${(props) => props.fontSize || '1.3rem'};
  text-align: center;
  letter-spacing: -0.857692px;
  color: #ecf0f3;
  text-align: ${(props) => props.textAlign || 'center'};
  margin: ${(props) => props.margin || '0'};
`;

export const VioletButton = styled((props) => (
  <BtnCustom
    width={props.width || '50%'}
    fontSize={'1.4rem'}
    height={'4.5rem'}
    textTransform={'capitalize'}
    backgroundColor={props.background || '#7380eb'}
    borderColor={props.background || '#7380eb'}
    btnColor={props.color || '#fff'}
    borderRadius={'1rem'}
    border={props.border || 'none'}
    {...props}
  />
))`
  outline: none;
`;

export const CardButton = styled.div`
  width: ${(props) => props.width || '20rem'};
  height: ${(props) => props.height || '20rem'};
  margin: ${(props) => props.margin || '0'};
  cursor: pointer;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background: ${(props) => props.background || '#383b45'};
  border-radius:${(props) => props.radius || '1rem'};
  transition: 0.2s;
  outline: none;
  opacity:${(props) => props.opacity || '1'}
  &: hover {
    box-shadow: 0px 0px 16px rgba(125, 125, 131, 0.1);
  }
`;

export const BoldTitle = styled.div`
  font-family: Avenir Next Bold;
  font-size: 1.6rem;
  letter-spacing: -0.523077px;
  color: #f8faff;
`;
