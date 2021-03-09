import styled from 'styled-components';

export const CardButton = styled.div`
  width: ${(props) => props.width || '20rem'};
  height: ${(props) => props.height || '20rem'};
  margin: ${(props) => props.margin || '0'};
  cursor: pointer;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background: #383b45;
  border-radius: 1rem;
  transition: 0.2s;
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
