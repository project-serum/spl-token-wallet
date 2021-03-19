import React from 'react';

import { Title, ColorText, RowContainer } from '../../pages/commonStyles';

import Attention from '../../images/attention.svg';

const AttentionComponent = ({
  blockHeight = '12rem',
  iconStyle = {},
  textStyle = {},
  text = '',
}) => {
  return (
    <RowContainer>
      <ColorText
        width={'100%'}
        height={blockHeight}
        background={'rgba(242, 154, 54, 0.5)'}
      >
        <img alt={'Attention'} src={Attention} style={iconStyle} />
        <span
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '87%',
            justifyContent: 'space-around',
            padding: '.5rem 0',
          }}
        >
          <Title
            fontSize={'1.2rem'}
            textAlign={'inherit'}
            style={{ ...textStyle, paddingRight: '1rem' }}
          >
            {text}
          </Title>
        </span>
      </ColorText>
    </RowContainer>
  );
};

export default AttentionComponent;
