import React from 'react';
import styled from 'styled-components';

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

  @media (max-width: 800px) {
    flex-direction: ${(props: RowProps) => props.mediaDirection || 'column'};
    justify-content: ${(props: RowProps) => props.mediaJustify || 'center'};
    margin: ${(props: RowProps) => props.mediaMargin || '0'};
  }
`;
export const RowContainer = styled((props) => <Row {...props} />)`
  width: 100%;
`;
