import Paper from '@material-ui/core/Paper';
import React from 'react';
import styled from 'styled-components';
import { BtnCustom } from '../BtnCustom';
import { Loading } from '../Loading';

export const TextField = styled.input`
  width: 100%;
  height: ${(props) => props.height || '3.5rem'};
  background: #383b45;
  border: 1px solid #3a475c;
  border-radius: 0.5rem;
  color: #fbf2f2;
  font-family: Avenir Next Medium;
  font-size: 1.4rem;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  outline: none;
  margin-top: 1rem;

  &:focus {
    border: ${(props) =>
      `0.1rem solid ${props.theme.customPalette.blue.serum}`};
  }
  &::placeholder {
    padding-top: 1rem;
  }
`;

export const MainTitle = styled.span`
  font-family: Avenir Next Bold;
  font-size: 3rem;
  line-height: 4rem;
  text-align: center;
  letter-spacing: -1.04615px;
  color: #f8faff;
  margin-bottom: 2rem;
`;

export const StyledTextArea = styled.textarea`
  width: 100%;
  height: ${(props) => props.height || '3.5rem'};
  background: #383b45;
  border: 1px solid #3a475c;
  border-radius: 0.5rem;
  color: #fbf2f2;
  font-family: Avenir Next Medium;
  font-size: 1.4rem;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  outline: none;
  margin-top: 1rem;
  padding-top: 1rem;
  resize: none;

  &:focus {
    border: ${(props) =>
      `0.1rem solid ${props.theme.customPalette.blue.serum}`};
  }
`;

export const Form = styled.form`
  width: 100%;
`;

export const Label = styled.label`
  width: 100%;
  color: #fbf2f2;
  font-family: Avenir Next Medium;
  font-size: 1.4rem;
`;

export const SubmitButton = styled.button`
  width: 100%;
  height: 4.5rem;
  background: ${(props) =>
    props.isDisabled ? '#93A0B2' : props.theme.customPalette.blue.serum};
  font-size: 1.4rem;
  text-transform: capitalize;
  border-radius: 1rem;
  border-color: none;
  cursor: pointer;
  color: #f8faff;
  border: none;
  font-family: Avenir Next Medium;
  margin-top: 4rem;
  transition: 0.3rem;
`;

export const StyledPaper = styled(Paper)`
  border-radius: 2rem;
  width: 60rem;
  height: auto;
  background: #222429;
  border: 0.1rem solid #3a475c;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem;
  padding: 3rem;
`;

export const TextArea = styled.div`
  width: 85%;
  height: 3.5rem;
  background: #383b45;
  border: 1px solid #3a475c;
  border-radius: 0.5rem;
  color: #fbf2f2;
  font-family: Avenir Next Medium;
  font-size: 1.4rem;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

export const Title = styled(({ ...props }) => <MainTitle {...props} />)`
  text-transform: none;
  font-size: 2.5rem;
  margin-bottom: 0;
`;

export const BlueButton = styled(
  ({ isUserConfident, showLoader, children, ...props }) => (
    <BtnCustom {...props}>
      {showLoader ? (
        <Loading
          color={'#fff'}
          size={24}
          style={{ display: 'flex', alignItems: 'center', height: '4.5rem' }}
        />
      ) : (
        children
      )}
    </BtnCustom>
  ),
)`
  font-size: 1.4rem;
  height: 4.5rem;
  text-transform: capitalize;
  background-color: ${(props) =>
    props.background || props.theme.customPalette.blue.serum};
  border-radius: 1rem;
  border-color: none;
  cursor: pointer;
  color: ${(props) => props.color || '#f8faff'};
  border: none;
`;

export const Text = styled.span`
  font-size: ${(props) => props.fontSize || '1.5rem'};
  padding-bottom: ${(props) => props.paddingBottom || '0'};
  text-transform: none;
  font-family: ${(props) => props.fontFamily || 'Avenir Next Medium'};
  color: ${(props) => props.color || '#ecf0f3'};
  white-space: ${(props) => props.whiteSpace || 'normal'};
  padding: ${(props) => props.padding || '0'};
`;

export const Line = styled.div`
  border: 0.1rem solid #383b45;
  height: 0.1rem;
  margin: 2rem 0;
  width: 100%;
`;
