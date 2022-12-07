import 'styled-components';

type Text = {
  fontSize: string;
  lineHeight: string;
  color: string;
  fontWeight: number;
};

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      tertiary: string;
      tertiaryDark: string;
      tertiaryLight: string;
      gradient: string;
    };
    text: {
      paragraph: Text;
      subtitle: Text;
      error: Text;
      detail: Text;
      smallTitle: Text;
    };
  }
}
