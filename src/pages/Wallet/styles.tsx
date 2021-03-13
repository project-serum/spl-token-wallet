import { Dialog, DialogContent, StepLabel, Tab, Tabs } from '@material-ui/core'
import styled from 'styled-components'

export const StyledDialogContent = styled(DialogContent)`
  &&& {
    width: ${(props) => props.width || '50rem'};
    height: ${(props) => props.height || '40rem'};
    background: #222429;
    border: 0.1rem solid #3a475c;
    box-shadow: 0px 0px 16px rgba(125, 125, 131, 0.1);
    border-radius: 2rem;
    display: flex;
    justify-content: ${(props) => props.justify || 'center'};
    flex-direction: column;
    align-items: center;
  }
`

export const StyledDialog = styled(Dialog)`
  &&& {
    width: ${(props) => props.width || '50rem'};
    height: ${(props) => props.height || '40rem'};
    background: #222429;
    border: 0.1rem solid #3a475c;
    box-shadow: 0px 0px 16px rgba(125, 125, 131, 0.1);
    border-radius: 2rem;
    display: flex;
    justify-content: ${(props) => props.justify || 'center'};
    flex-direction: column;
    align-items: center;
  }
`

export const StyledTabs = styled(Tabs)`
  & > div > span {
    background: ${props => props.theme.customPalette.blue.serum} !important;
  }
`

export const StyledTab = styled(Tab)`
  &&& {
    color: ${props => props.theme.customPalette.blue.serum};
    border-color: ${props => props.theme.customPalette.blue.serum};
    text-transform: capitalize;
    font-size: 1.4rem;
    font-family: Avenir Next Demi;
    white-space: nowrap;
  }
`

export const StyledStepLabel = styled(StepLabel)`
  & span {
    font-size: 1.4rem;
  }

  & svg {
    width: 2rem;
    height: 2rem;

    text {
      font-size: 1.4rem;
    }
  }
`