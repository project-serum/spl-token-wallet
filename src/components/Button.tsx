import styled from 'styled-components';
import { BORDER_RADIUS, FONTS, FONT_SIZES, WIDTH } from './variables';

const PADDINGS = {
  md: '4px 10px', // 16px
  lg: '8px 16px',
};

export interface ButtonProps {
  fontSize?: keyof typeof FONT_SIZES;
  borderRadius?: keyof typeof BORDER_RADIUS;
  padding?: keyof typeof PADDINGS;
  backgroundImage?: string;
  width?: keyof typeof WIDTH;
  backgroundColor?: string;
}

export const Button = styled.button<ButtonProps>`
  background-color: ${(props: ButtonProps) => props.backgroundColor || 'none'};
  background: ${(props: ButtonProps) => props.backgroundColor || 'none'};
  min-width: 9rem;
  color: white;
  text-align: center;
  font-size: ${(props: ButtonProps) => FONT_SIZES[props.fontSize || 'md']};
  border: 1px solid transparent;
  line-height: 150%;
  cursor: pointer;
  padding: ${(props: ButtonProps) => PADDINGS[props.padding || 'md']};
  font-family: ${FONTS.main};
  border-radius: ${(props: ButtonProps) =>
    BORDER_RADIUS[props.borderRadius || 'md']};
  ${(props: ButtonProps) =>
    props.width ? ` width: ${WIDTH[props.width]};` : ''}
  text-decoration: none;

  ${({ backgroundImage }: ButtonProps) =>
    backgroundImage
      ? `
    background-color: #a1458a;
    border-color: transparent;
    background-image: url(${backgroundImage});
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
  `
      : ''}
  &:disabled {
    cursor: not-allowed;
  }
`;
