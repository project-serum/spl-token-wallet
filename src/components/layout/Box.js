import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 5px;
  -webkit-box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
`;

export default function Box({ style, children }) {
  return <Wrapper style={{ ...style }}>{children}</Wrapper>;
}
