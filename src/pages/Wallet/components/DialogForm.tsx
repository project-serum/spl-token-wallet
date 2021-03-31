import React from 'react';
import styled from 'styled-components'
import { Dialog } from '@material-ui/core';
import { Card } from '../../commonStyles';

const StyledCard = styled(Card)`
  && {
    max-width: 100%;
  }
`

export default function DialogForm({
  open,
  onClose,
  onSubmit = () => {},
  ...rest
}) {
  // const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <Dialog
      open={open}
      PaperComponent={StyledCard}
      PaperProps={{
        component: 'form',
        onSubmit: (e) => {
          e.preventDefault();
          if (onSubmit) {
            onSubmit();
          }
        },
        // @ts-ignore
        height: rest.height,
        width: rest.width,
        padding: rest.padding,
        maxWidth: '100%'
      }}
      onClose={onClose}
      // fullScreen={fullScreen}
      {...rest}
    />
  );
}
