import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
    };
    text: {
      paragraph: {
        fontSize: string;
        lineHeight: string;
        color: string;
      };
    };
  }
}
