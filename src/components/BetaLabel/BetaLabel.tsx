import React from 'react'
import styled from 'styled-components'
import { Theme } from '@material-ui/core'
import { CSSProperties } from 'react'

const Text = styled.span`
  color: ${(props) => props.theme.customPalette.white.text || '#F5F5FB'};
  background: #f79894;
  font-family: Avenir Next Demi;
  font-size: 1.4rem;
  height: 2rem;
  line-height: 2rem;
  border-radius: 1.6rem;
  padding: 0 0.6rem;

  ${(props) => props.style}
`

export const BetaLabel = ({
  theme,
  style = {},
}: {
  theme: Theme
  style?: CSSProperties
}) => {
  return (
    <Text theme={theme} style={style}>
      Beta
    </Text>
  )
}
