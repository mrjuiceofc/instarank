import styled, { createGlobalStyle, css } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Poppins', sans-serif;
  }

  html,
  body {
    color: ${({ theme }) => theme.text.paragraph.color};
    font-size: ${({ theme }) => theme.text.paragraph.fontSize};
    line-height: ${({ theme }) => theme.text.paragraph.lineHeight};
    font-weight: ${({ theme }) => theme.text.paragraph.fontWeight};
    padding: 0;
    margin: 0;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  * {
    box-sizing: border-box;
  }
`;

export const Error = styled.span`
  ${({ theme }) => css`
    color: ${theme.text.error.color};
    font-size: ${theme.text.error.fontSize};
    line-height: ${theme.text.error.lineHeight};
    font-weight: ${theme.text.error.fontWeight};
  `}
`;

export default GlobalStyle;
