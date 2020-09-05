import { Button, Col, Row } from 'antd';
import * as R from 'ramda';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
const Title = styled.h1`
  font-size: 30px;
`;
const Box = styled(Row)`
  height: 140px;
  border-radius: 10px;
  border: solid 1px #74daf6;
  background-color: #2b2c34;
  width: 80%;
  min-width: 1100px;
  padding: 16px;
  overflow: scroll;
`;
const ButtonWrapper = styled(Col)`
  width: 15.73%;
  margin: 0 12px 12px 0;
  &:nth-child(6n) {
    margin-right: 0;
  }
`;
const Btn = styled(Button)`
  width: 100%;
  height: 48px;
  border-radius: 6px;
`;

const Step2 = (props) => {
  const { setConfirmBtn } = props;
  const [list, setList] = useState([]);
  const addItem = useCallback(
    (p: string) => {
      if (list.includes(p)) {
        setList(R.reject(R.equals(p), list));
      } else {
        setList([...list, p]);
      }
    },
    [list],
  );
  useEffect(() => {
    setConfirmBtn(list.length === 0);
  }, [list, setConfirmBtn]);
  return (
    <>
      <Title>Confirm your Secret Backup Phrase</Title>
      <div style={{ margin: '20px 0 16px' }}>
        Phrase Please select each phrase in orderto make sureitiscorect.
      </div>
      <Box>
        {list.map((item, index) => {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <ButtonWrapper key={item + index}>
              <Button
                type="primary"
                size="large"
                style={{
                  width: '100%',
                  height: 48,
                  borderRadius: 6,
                  background: '#34363f',
                  border: 0,
                  color: '#74daf6',
                }}
              >
                {item}
              </Button>
            </ButtonWrapper>
          );
        })}
      </Box>
      <Row style={{ padding: '24px 16px', width: '80%', minWidth: 1100 }}>
        <ButtonWrapper onClick={() => addItem('phrase')}>
          <Btn
            type="primary"
            size="large"
            ghost={!list.includes('phrase')}
            style={{
              background: list.includes('phrase') ? '#2b2c34' : 'transparent',
              borderColor: list.includes('phrase') ? 'transparent' : '#74daf6',
              color: '#74daf6',
            }}
          >
            phrase
          </Btn>
        </ButtonWrapper>
        <ButtonWrapper onClick={() => addItem('phrase1')}>
          <Btn
            type="primary"
            size="large"
            ghost={!list.includes('phrase1')}
            style={{
              background: list.includes('phrase1') ? '#2b2c34' : 'transparent',
              borderColor: list.includes('phrase1') ? 'transparent' : '#74daf6',
              color: '#74daf6',
            }}
          >
            phrase1
          </Btn>
        </ButtonWrapper>
        <ButtonWrapper onClick={() => addItem('phrase2')}>
          <Btn
            type="primary"
            size="large"
            ghost={!list.includes('phrase2')}
            style={{
              background: list.includes('phrase2') ? '#2b2c34' : 'transparent',
              borderColor: list.includes('phrase2') ? 'transparent' : '#74daf6',
              color: '#74daf6',
            }}
          >
            phrase2
          </Btn>
        </ButtonWrapper>
        <ButtonWrapper onClick={() => addItem('phrase3')}>
          <Btn
            type="primary"
            size="large"
            ghost={!list.includes('phrase3')}
            style={{
              background: list.includes('phrase3') ? '#2b2c34' : 'transparent',
              borderColor: list.includes('phrase3') ? 'transparent' : '#74daf6',
              color: '#74daf6',
            }}
          >
            phrase3
          </Btn>
        </ButtonWrapper>
        <ButtonWrapper onClick={() => addItem('phrase4')}>
          <Btn
            type="primary"
            size="large"
            ghost={!list.includes('phrase4')}
            style={{
              background: list.includes('phrase4') ? '#2b2c34' : 'transparent',
              borderColor: list.includes('phrase4') ? 'transparent' : '#74daf6',
              color: '#74daf6',
            }}
          >
            phrase4
          </Btn>
        </ButtonWrapper>
        <ButtonWrapper onClick={() => addItem('phrase5')}>
          <Btn
            type="primary"
            size="large"
            ghost={!list.includes('phrase5')}
            style={{
              background: list.includes('phrase5') ? '#2b2c34' : 'transparent',
              borderColor: list.includes('phrase5') ? 'transparent' : '#74daf6',
              color: '#74daf6',
            }}
          >
            phrase5
          </Btn>
        </ButtonWrapper>
        <ButtonWrapper onClick={() => addItem('phrase6')}>
          <Btn
            type="primary"
            size="large"
            ghost={!list.includes('phrase6')}
            style={{
              background: list.includes('phrase6') ? '#2b2c34' : 'transparent',
              borderColor: list.includes('phrase6') ? 'transparent' : '#74daf6',
              color: '#74daf6',
            }}
          >
            phrase6
          </Btn>
        </ButtonWrapper>
        <ButtonWrapper onClick={() => addItem('phrase7')}>
          <Btn
            type="primary"
            size="large"
            ghost={!list.includes('phrase7')}
            style={{
              background: list.includes('phrase7') ? '#2b2c34' : 'transparent',
              borderColor: list.includes('phrase7') ? 'transparent' : '#74daf6',
              color: '#74daf6',
            }}
          >
            phrase7
          </Btn>
        </ButtonWrapper>
        <ButtonWrapper onClick={() => addItem('phrase8')}>
          <Btn
            type="primary"
            size="large"
            ghost={!list.includes('phrase8')}
            style={{
              background: list.includes('phrase8') ? '#2b2c34' : 'transparent',
              borderColor: list.includes('phrase8') ? 'transparent' : '#74daf6',
              color: '#74daf6',
            }}
          >
            phrase8
          </Btn>
        </ButtonWrapper>
        <ButtonWrapper onClick={() => addItem('phrase9')}>
          <Btn
            type="primary"
            size="large"
            ghost={!list.includes('phrase9')}
            style={{
              background: list.includes('phrase9') ? '#2b2c34' : 'transparent',
              borderColor: list.includes('phrase9') ? 'transparent' : '#74daf6',
              color: '#74daf6',
            }}
          >
            phrase9
          </Btn>
        </ButtonWrapper>
        <ButtonWrapper onClick={() => addItem('phrase10')}>
          <Btn
            type="primary"
            size="large"
            ghost={!list.includes('phrase10')}
            style={{
              background: list.includes('phrase10') ? '#2b2c34' : 'transparent',
              borderColor: list.includes('phrase10')
                ? 'transparent'
                : '#74daf6',
              color: '#74daf6',
            }}
          >
            phrase10
          </Btn>
        </ButtonWrapper>
        <ButtonWrapper onClick={() => addItem('phrase11')}>
          <Btn
            type="primary"
            size="large"
            ghost={!list.includes('phrase11')}
            style={{
              background: list.includes('phrase11') ? '#2b2c34' : 'transparent',
              borderColor: list.includes('phrase11')
                ? 'transparent'
                : '#74daf6',
              color: '#74daf6',
            }}
          >
            phrase11
          </Btn>
        </ButtonWrapper>
        <ButtonWrapper onClick={() => addItem('phrase12')}>
          <Btn
            type="primary"
            size="large"
            ghost={!list.includes('phrase12')}
            style={{
              background: list.includes('phrase12') ? '#2b2c34' : 'transparent',
              borderColor: list.includes('phrase12')
                ? 'transparent'
                : '#74daf6',
              color: '#74daf6',
            }}
          >
            phrase12
          </Btn>
        </ButtonWrapper>
        <ButtonWrapper onClick={() => addItem('phrase13')}>
          <Btn
            type="primary"
            size="large"
            ghost={!list.includes('phrase13')}
            style={{
              background: list.includes('phrase13') ? '#2b2c34' : 'transparent',
              borderColor: list.includes('phrase13')
                ? 'transparent'
                : '#74daf6',
              color: '#74daf6',
            }}
          >
            phrase13
          </Btn>
        </ButtonWrapper>
      </Row>
    </>
  );
};
export default React.memo(Step2);
