import { Link } from '@material-ui/core';
import styled from 'styled-components';
import { RowContainer } from '../../pages/commonStyles';

export const FooterComponent = styled(RowContainer)`
  display: none;
  @media (max-width: 600px) {
    display: flex;
    background-color: #222429;
    border-top: 0.1rem solid #383b45;
    padding: 0 2rem;
    justify-content: space-between;
  }
`;
export const StyledLink = styled(Link)`
  width: 6rem;
  height: 5rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  text-decoration: none;
  color: #fbf2f2;
  font-family: Avenir Next Medium;
  font-size: 1.3rem;
  span {
    margin-top: 1rem;
  }
`;
export const StyledA = styled.a`
  width: 6rem;
  height: 5rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  text-decoration: none;
  color: #fbf2f2;
  font-family: Avenir Next Medium;
  font-size: 1.3rem;
  span {
    margin-top: 1rem;
  }
`;
