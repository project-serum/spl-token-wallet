import React from 'react';
import styled from 'styled-components';

export const Img = styled.div`
  width: ${(props) => props.width || '30rem'};
  height: ${(props) => props.width || '15rem'};
`;
export const Row = styled.div`
  width: ${(props) => props.width || '100%'};
  height: ${(props) => props.height || '100%'};
  display: flex;
  justify-content: ${(props) => props.justify || 'center'};
  flex-direction: ${(props) => props.direction || 'row'};
  align-items: ${(props) => props.align || 'center'};
`;

export const Card = styled.div`
  width: ${(props) => props.width || '50rem'};
  height: ${(props) => props.width || '40rem'};
  background: #222429;
  border: 0.1rem solid #3a475c;
  box-shadow: 0px 0px 16px rgba(125, 125, 131, 0.1);
  border-radius: 2rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

export const Input = styled.input`
  width: ${(props) => props.width || '90%'};
  height: 5rem;
  border: 1px solid #3a475c;
  box-sizing: border-box;
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
  color: #f79894;
  border: none;
  background-color: #222429;
  backgroung: #222429;
  width: 50%;
`;

export const Title = styled.div`
  font-family: Avenir Next Medium;
  font-style: normal;
  font-weight: normal;
  font-size: ${(props) => props.fontSize || '1.3rem'};
  text-align: center;
  letter-spacing: -0.457692px;
  color: #ecf0f3;
`;

export const VioletButton = styled.button`
  background: #7380eb;
  border-radius: 1rem;
  color: #fff;
  border: none;
  width: 50%;
  height: 4.5rem;
`;
