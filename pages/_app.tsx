import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { ThemeProvider, DefaultTheme } from 'styled-components';
import GlobalStyle from '../lib/components/globalstyles';
import AuthProvider from '../lib/context/AuthProvider';
import GlobalProvider from '../lib/context/GlobalProvider';
import useGlobal from '../lib/hooks/useGlobal';
import pxToRem from '../lib/utils/pxToRem';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Header } from '../lib/components/Header';
import 'react-tooltip/dist/react-tooltip.css';
import Footer from '../lib/components/Footer';
import { Warnings } from '../lib/components/Warnings';
import Script from 'next/script';
import * as gtag from '../lib/gtag';
import { hotjar } from 'react-hotjar';

const theme: DefaultTheme = {
  colors: {
    primary: '#111',
    secondary: '#1877F2',
    tertiary: '#EBEBEB',
    tertiaryDark: '#5A686C',
    tertiaryLight: '#F8F8F8',
    gradient:
      'linear-gradient(269.53deg, #A336BD -4.74%, #FF387D 29.23%, #FF5D34 70.94%, #FFAA1B 105.94%)',
    light: '#FFFFFF',
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
    title: {
      fontSize: pxToRem(38.1),
      color: '#333333',
      lineHeight: pxToRem(58.1),
      fontWeight: 500,
    },
  },
};

type PageContentProps = {
  Component: any;
  pageProps: any;
};

function PageContent({ Component, pageProps }: PageContentProps) {
  const { openLoginModal } = useGlobal();
  const router = useRouter();

  useEffect(() => {
    if (router.query.loginModal) {
      openLoginModal();
      router.replace(router.pathname, undefined, { shallow: true });
    }
  }, [router.query]);

  useEffect(() => {
    const isLocalhost = window.location.hostname === 'localhost';

    if (isLocalhost) {
      return;
    }

    import('react-facebook-pixel')
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.init(process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID);
        ReactPixel.pageView();

        router.events.on('routeChangeComplete', () => {
          ReactPixel.pageView();
        });
      });
  }, [router.events]);

  useEffect(() => {
    const isLocalhost = window.location.hostname === 'localhost';

    if (isLocalhost) {
      return;
    }

    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
    if (!router.query) {
      return;
    }

    if (router.query.utm_source) {
      localStorage.setItem('utmSource', router.query.utm_source as string);
    }

    if (router.query.utm_medium) {
      localStorage.setItem('utmMedium', router.query.utm_medium as string);
    }

    if (router.query.utm_campaign) {
      localStorage.setItem('utmCampaign', router.query.utm_campaign as string);
    }
  }, [router.query]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const isLocalhost = window.location.hostname === 'localhost';

    if (isLocalhost) {
      return;
    }

    hotjar.initialize(
      Number(process.env.NEXT_PUBLIC_HJID),
      Number(process.env.NEXT_PUBLIC_HJSV)
    );
  }, []);

  return (
    <>
      <Header />
      <Component {...pageProps} />
      <Footer />
      <Warnings />
      {typeof window !== 'undefined' &&
        window.location.hostname !== 'localhost' && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
            />
            <Script
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
              }}
            />
          </>
        )}
    </>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <GlobalProvider>
            <GlobalStyle />
            <PageContent Component={Component} pageProps={pageProps} />
            <ToastContainer />
          </GlobalProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}
