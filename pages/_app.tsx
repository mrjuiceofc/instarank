import type { AppProps } from 'next/app';
import { ThemeProvider, DefaultTheme } from 'styled-components';
import GlobalStyle from '../lib/components/globalstyles';
import pxToRem from '../lib/utils/pxToRem';

const theme: DefaultTheme = {
  colors: {
    primary: '#111',
    secondary: '#0070f3',
  },
  text: {
    paragraph: {
      fontSize: pxToRem(16),
      lineHeight: pxToRem(24),
      color: '#333333',
    },
  },
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
