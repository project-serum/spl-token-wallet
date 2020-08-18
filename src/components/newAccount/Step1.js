import {
  CloudDownloadOutlined,
  ExclamationCircleFilled,
  LockFilled,
} from '@ant-design/icons';
import { Row } from 'antd';
import React from 'react';
import styled from 'styled-components';
const Title = styled.h1`
  font-size: 30px;
`;
const Warning = styled(Row)`
  color: #e6ac71;
  border-radius: 10px;
  background-color: rgba(230, 172, 113, 0.1);
  padding: 9px 12px;
  width: fit-content;
  margin-bottom: 32px;
`;
const LockWrapper = styled.div`
  padding: 24px 40px;
  border-radius: 10px;
  background-color: #2b2c34;
  font-size: 22px;
  position: relative;
  border: solid 1px #74daf6;
  color: #fff;
  font-weight: bold;
`;
const Lock = styled.div`
  position: absolute;
  top: -1px;
  left: -1px;
  backdrop-filter: blur(6px);
  background-color: rgba(43, 44, 52, 0.8);
  width: calc(100% + 2px);
  height: 120px;
  line-height: 120px;
  text-align: center;
  cursor: pointer;
  border: solid 1px #585a68;
  border-radius: 10px;
`;

const Step1 = (props) => {
  const { openLock, isDisabled } = props;
  return (
    <>
      <Title>Secret Backup Phrase</Title>
      <div style={{ margin: '20px 0 16px' }}>
        Your secret backup phrase makes it easy t backup and restore your
        account.
      </div>
      <Warning align="middle">
        <ExclamationCircleFilled style={{ marginRight: 6 }} />
        WARNING: Never disclose your backup phrase.Anyone with this phrasecan
        take your Ether forever.
      </Warning>
      <LockWrapper>
        phrase lens defense jacket around increase link oppose grab february
        later stamp
        {isDisabled && (
          <Lock onClick={openLock}>
            <LockFilled style={{ marginRight: 14 }} />
            CLICK HERE TO REVEAL SECRET WORDS
          </Lock>
        )}
      </LockWrapper>
      <Row style={{ color: '#6099ff', margin: '27px 0 16px' }} align="middle">
        <CloudDownloadOutlined style={{ fontSize: 20, marginRight: 6 }} />
        Download this Secret Backup Phrase
      </Row>
      <span>
        And keep it stored safely on an external encrypted hard drive or storage
        medium.
      </span>
    </>
  );
};
export default React.memo(Step1);
