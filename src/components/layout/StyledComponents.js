import styled from 'styled-components';
import { Button } from 'antd';

export const Box = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: white;
  -webkit-box-shadow: 0px 0px 35px 0px rgba(0, 0, 0, 0.075);
  -moz-box-shadow: 0px 0px 35px 0px rgba(0, 0, 0, 0.075);
  box-shadow: 0px 0px 35px 0px rgba(0, 0, 0, 0.075);
`;

export const CreateWalletBox = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 20px;
  border-radius: 10px;
  -webkit-box-shadow: 0px 0px 20px 0px rgba(0, 210, 211, 0.75);
  -moz-box-shadow: 0px 0px 20px 0px rgba(0, 210, 211, 0.75);
  box-shadow: 0px 0px 20px 0px rgba(0, 210, 211, 0.75);
`;

export const RestoreWalletBox = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 20px;
  border-radius: 10px;
  -webkit-box-shadow: 0px 0px 20px 0px rgba(84, 160, 255, 0.75);
  -moz-box-shadow: 0px 0px 20px 0px rgba(84, 160, 255, 0.75);
  box-shadow: 0px 0px 20px 0px rgba(84, 160, 255, 0.75);
`;

export const Text = styled.span`
  color: rgba(0, 0, 0, 0.5);
`;

export const ActionButton = styled(Button)`
  margin: 20px 0px 0px 0px;
  background: #00d2d3;
  border-color: #00d2d3;
  border-radius: 10px;
`;
