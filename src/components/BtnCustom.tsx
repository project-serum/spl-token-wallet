import React from 'react'
import styled from 'styled-components'
import { Button } from '@material-ui/core'

type Props = {
  btnWidth: string,
  height: string,
  btnColor: string,
  borderRadius: string,
  color: string,
  margin: string,
  padding: string,
  fontSize: string,
  backgroundColor: string,
  borderColor: string,
  hoverBackground: string,
  fontFamily: string,
  borderWidth: string,
  letterSpacing: string,
  hoverColor: string,
  transition: string,
  needMinWidth: string,
  textTransform: string,
  hoverBorderColor: string,
  boxShadow: string,
  fontWeight: number | string,
  href?: string
}

export const BtnCustom = styled(
  ({
    btnWidth,
    height,
    btnColor,
    borderRadius,
    color,
    margin,
    padding,
    fontSize,
    fontFamily,
    backgroundColor,
    borderColor,
    hoverBackground,
    borderWidth,
    letterSpacing,
    hoverColor,
    transition,
    needMinWidth,
    textTransform,
    hoverBorderColor,
    ...rest
  }: Props) => <Button {...rest} />
)`
  &&& {
    color: ${(props: Props) => props.btnColor || props.color || '#333'};
  }
  
  width: ${(props: Props) => props.btnWidth || '22.5rem'};
  height: ${(props: Props) => props.height || `3rem`};
  border: 0.1rem solid
    ${(props: Props) => props.borderColor || props.btnColor || props.color || '#333'};
  border-radius: ${(props: Props) => props.borderRadius || '.8rem'};
  border-width: ${(props: Props) => props.borderWidth || '.1rem'};
  border-color: ${(props: Props) =>
    props.borderColor || props.btnColor || props.color || '#333'};
  font-family: ${(props: Props) => props.fontFamily || 'Avenir Next Medium'};
  font-size: ${(props: Props) => props.fontSize || '1rem'};
  font-weight: ${(props: Props) => props.fontWeight || 500};
  margin: ${(props: Props) => props.margin || '0px'};
  padding: ${(props: Props) => props.padding || '3px 0px'};
  letter-spacing: ${(props: Props) => props.letterSpacing || '0.01rem'};
  background: ${(props: Props) => props.backgroundColor || 'transparent'};
  min-width: ${(props: Props) => !props.needMinWidth && 'auto'};
  text-transform: ${(props: Props) => props.textTransform || 'uppercase'};
  box-shadow: ${(props: Props) => props.boxShadow || 'none'};
  transition: all .3s ease-out;

  &:hover {
    color: ${(props: Props) => props.hoverColor};
    border-color: ${(props: Props) => props.hoverBorderColor};
    background: ${(props: Props) => props.hoverBackground || props.backgroundColor};
    transition: ${(props: Props) => props.transition || 'all .3s ease-out'};
  }
`
