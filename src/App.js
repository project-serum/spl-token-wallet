import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import Container from '@material-ui/core/Container';
import NavigationFrame from './components/NavigationFrame';
import { ConnectionProvider } from './utils/connection';

function App() {
  // TODO: add toggle for dark mode
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
          primary: blue,
        },
      }),
    [prefersDarkMode],
  );
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ConnectionProvider>
        <NavigationFrame>
          <Container fixed maxWidth="md">
            <Button variant="contained" color="secondary">
              Hello World
            </Button>
          </Container>
        </NavigationFrame>
      </ConnectionProvider>
    </ThemeProvider>
  );
}

export default App;
