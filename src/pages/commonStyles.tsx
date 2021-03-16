import styled from 'styled-components';
import { BtnCustom } from '../components/BtnCustom';
import { Grid, Checkbox, Radio } from '@material-ui/core';

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

export const Row = styled(
  ({
    wrap,
    justify,
    direction,
    align,
    width,
    height,
    margin,
    padding,
    ...props
  }) => <div {...props} />,
)`
  display: flex;
  flex-wrap: ${(props: RowProps) => props.wrap || 'nowrap'};
  justify-content: ${(props: RowProps) => props.justify || 'center'};
  flex-direction: ${(props: RowProps) => props.direction || 'row'};
  align-items: ${(props: RowProps) => props.align || 'center'};
  width: ${(props: RowProps) => props.width || 'auto'};
  height: ${(props: RowProps) => props.height || 'auto'};
  margin: ${(props: RowProps) => props.margin || '0'};
  padding: ${(props: RowProps) => props.padding || '0'};
`;

export const RowContainer = styled((props) => <Row {...props} />)`
  width: ${(props: RowProps) => props.width || '100%'};
`;

export const GridContainer = styled(({ theme, ...rest }) => <Grid {...rest} />)`
  position: relative;
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

  @media (max-width: 850px) {
    display: none;
  }
`;

export const ColorText = styled.div`
  width: ${(props) => props.width || '100%'};
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
  width: ${(props) => props.width || '100%'};
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
  position: relative;
  line-height: 3rem;
`;

export const ContainerForIcon = styled.div`
  cursor: pointer;
  width: 4rem;
  height: 3.5rem;
  border-radius: 1.5rem;
  border: 0.2rem solid #3a475c;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Img = styled.div`
  width: ${(props) => props.width || 'auto'};
  height: ${(props) => props.width || 'auto'};
  margin-bottom: ${(props) => props.margin || '0rem'};
`;

export const Card = styled.div`
  width: ${(props) => props.width || '50rem'};
  height: ${(props) => props.height || '40rem'};
  padding: ${props => props.padding || '0'};
  background: #222429;
  border: 0.1rem solid #3a475c;
  box-shadow: 0px 0px 16px rgba(125, 125, 131, 0.1);
  border-radius: 2rem;
  display: flex;
  justify-content: ${(props) => props.justify || 'center'};
  flex-direction: column;
  align-items: center;

  transition: 0.3s all ease-out;
`;

export const Input = styled(({ ...props }) => (
  <input autoComplete="off" {...props} />
))`
  width: ${(props) => props.width || '100%'};
  height: ${(props) => props.height || '4.5rem'};
  color: #fff;
  font-family: Avenir Next Medium;
  border: 0.1rem solid #3a475c;
  box-sizing: border-box;
  font-size: 1.5rem;
  border-radius: 1.5rem;
  background: #222429;
  outline: none;
  padding-left: 2rem;
  padding-right: 10rem;

  // fix for autocomplete
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-box-shadow: 0px 0px 0 50px #222429 inset !important;
    -webkit-text-fill-color: #fff;
  }

  ${(props) => props.style};
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

export const Title = styled(
  ({ width, fontFamily, fontSize, color, textAlign, margin, ...props }) => (
    <span {...props} />
  ),
)`
  width: ${(props) => props.width || 'auto'};
  font-family: ${(props) => props.fontFamily || 'Avenir Next Medium'};
  font-style: normal;
  font-weight: normal;
  font-size: ${(props) => props.fontSize || '1.4rem'};
  text-align: center;
  color: ${(props) => props.color || '#ecf0f3'};
  text-align: ${(props) => props.textAlign || 'center'};
  margin: ${(props) => props.margin || '0'};
`;

export const VioletButton = styled((props) => (
  <BtnCustom
    btnWidth={props.width || '50%'}
    fontSize={'1.4rem'}
    height={'4.5rem'}
    textTransform={'capitalize'}
    backgroundColor={
      props.disabled
        ? props.theme.customPalette.grey.dark
        : props.background || props.theme.customPalette.blue.serum
    }
    borderColor={
      props.disabled
        ? props.theme.customPalette.grey.dark
        : props.background || props.theme.customPalette.blue.serum
    }
    btnColor={props.color || props.theme.customPalette.white.main}
    borderRadius={'1rem'}
    border={props.border || 'none'}
    {...props}
  />
))`
  outline: none;
`;

export const RedButton = styled((props) => (
  <BtnCustom
    btnWidth={props.width || '50%'}
    fontSize={'1.4rem'}
    height={'4.5rem'}
    textTransform={'capitalize'}
    backgroundColor={props.background || 'transparent'}
    borderColor={props.background || 'transparent'}
    btnColor={props.color || props.theme.customPalette.red.main}
    borderRadius={'1rem'}
    border={props.border || 'none'}
    {...props}
  />
))`
  outline: none;
`;

export const WhiteButton = styled((props) => (
  <BtnCustom
    btnWidth={props.width || 'calc(50% - .5rem)'}
    fontSize={'1.4rem'}
    height={'4.5rem'}
    textTransform={'capitalize'}
    backgroundColor={props.background || 'transparent'}
    borderColor={props.background || props.theme.customPalette.white.main}
    btnColor={props.color || props.theme.customPalette.white.main}
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
  border-radius: ${(props) => props.radius || '1rem'};
  transition: 0.2s;
  outline: none;
  opacity: ${(props) => props.opacity || '1'};
  text-decoration: none;
  &: hover {
    box-shadow: 0px 0px 16px rgba(125, 125, 131, 0.1);
  }
`;

export const BoldTitle = styled.div`
  font-family: Avenir Next Demi;
  font-size: ${(props) => props.fontSize || '1.6rem'};
  letter-spacing: -0.523077px;
  color: ${(props) => props.color || '#f8faff'};
`;

export const Legend = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 75%;
  height: 0.1rem;
  background: #383b45;
`;

export const StyledLabel = styled.label`
  font-family: Avenir Next;
  font-size: ${(props) => props.fontSize || '1.2rem'};
  color: #93a0b2;
  cursor: pointer;
`;

export const StyledCheckbox = styled(Checkbox)`
  &&& {
    color: ${(props) =>
      props.disabled
        ? props.theme.customPalette.grey.light
        : props.color || props.theme.customPalette.blue.new};
    &:hover {
      background-color: rgba(54, 108, 229, 0.1);
    }
  }

  & svg {
    width: 2rem;
    height: 2rem;
  }
`;

export const StyledRadio = styled(Radio)`
  &&& {
    color: ${(props) => props.color || props.theme.customPalette.blue.new};
    &:hover {
      background-color: rgba(54, 108, 229, 0.1);
    }
  }

  & svg {
    width: 2rem;
    height: 2rem;
  }
`;

export const SearchInput = styled.input`
  background: #383b45;
  border: 1px solid #3a475c;
  border-radius: 1.7rem;
  outline: none;
  width: 100%;
  height: 3.5rem;
  color: #fff;
  padding: 0 2rem;
`;

export const ListCard = styled.div`
  width: ${(props) => props.width || '100%'};
  height: ${(props) => props.height || '20rem'};
  background: #222429;
  border: 0.1rem solid #3a475c;
  border-radius: 1rem;
  display: flex;
  justify-content: end;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  padding: 0 1.6rem;
`;

export const ExclamationMark = styled(({ fontSize, lineHeight, ...props }) => (
  <span {...props}>!</span>
))`
  color: ${(props) => props.color || props.theme.customPalette.orange.dark};
  font-family: Avenir Next Demi;
  font-size: ${(props) => props.fontSize || '5rem'};
  line-height: ${(props) => props.lineHeight || '6rem'};
  margin: ${(props) => props.margin || '0 2rem 0 0'};
`;
