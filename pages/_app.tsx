import type { AppProps } from 'next/app';
import { ThemeProvider, DefaultTheme } from 'styled-components';
import GlobalStyle from '../lib/components/globalstyles';
import AuthProvider from '../lib/context/AuthProvider';
import GlobalProvider from '../lib/context/GlobalProvider';
import pxToRem from '../lib/utils/pxToRem';

const theme: DefaultTheme = {
  colors: {
    primary: '#111',
    secondary: '#1877F2',
    tertiary: '#EBEBEB',
    tertiaryDark: '#5A686C',
    tertiaryLight: '#F8F8F8',
    gradient:
      'linear-gradient(269.53deg, #A336BD -4.74%, #FF387D 29.23%, #FF5D34 70.94%, #FFAA1B 105.94%)',
  },
  text: {
    paragraph: {
      fontSize: pxToRem(16),
      lineHeight: pxToRem(24),
      color: '#333333',
      fontWeight: 300,
    },
    subtitle: {
      fontSize: pxToRem(20),
      lineHeight: pxToRem(30),
      color: '#5A686C',
      fontWeight: 400,
    },
    error: {
      fontSize: pxToRem(12),
      lineHeight: pxToRem(21),
      color: '#FF5D34',
      fontWeight: 300,
    },
    detail: {
      fontSize: pxToRem(12),
      lineHeight: pxToRem(21),
      color: '#5A686C',
      fontWeight: 500,
    },
    smallTitle: {
      fontSize: pxToRem(16),
      color: '#000000',
      lineHeight: pxToRem(24),
      fontWeight: 500,
    },
  },
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <GlobalProvider>
            <GlobalStyle />
            <Component {...pageProps} />
          </GlobalProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}
