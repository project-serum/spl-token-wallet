import styled from 'styled-components';

export interface TextProps {
  size?: string;
  color?: string;
  weight?: 100 | 200 | 400 | 500 | 600 | 700;
  maxWidth?: string;
  noWrap?: boolean;
}

export const Text = styled.p<TextProps>`
  font-size: 1em;
  line-height: 150%;
  color: #fff;
  font-weight: ${(props: TextProps) => props.weight || 400};
  letter-spacing: -0.52px;
  margin: 10px 0 0 0;
  ${(props: TextProps) =>
    props.maxWidth ? `max-width: ${props.maxWidth};` : ''}
  ${(props: TextProps) => (props.noWrap ? `white-space: nowrap;` : '')}
`;

// interface InlineProps {
//   size?: string;
//   color?: string;
// }

// export const InlineText = styled.span<InlineProps>`
//   ${(props: InlineProps) =>
//     props.color ? `color: ${COLORS[props.color]};` : ''}
//   ${(props: InlineProps) =>
//     props.size ? `font-size: ${FONT_SIZES[props.size]};` : ''}
// `;
