import React from 'react'
import styled from 'styled-components'
import { Grid } from '@material-ui/core'

export type RowProps = {
  wrap?: string
  justify?: string
  direction?: string
  align?: string
  width?: string
  height?: string
  margin?: string
  padding?: string
}

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
`
export const RowContainer = styled((props) => <Row {...props} />)`
  width: 100%;
`

export const GridContainer = styled(({ ...rest }) => (
  <Grid {...rest} />
))`
  display: flex;
  flex: auto;
  align-items: center;
  width: calc(100%);
  height: 6rem;
  position: relative;
  padding: 0rem 3rem;
  border-bottom: ${(props) => props.theme.palette.border.new};
  margin: 0rem;
  background: ${(props) => props.theme.palette.grey.additional};
`