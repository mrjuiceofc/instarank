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

export const Loading = styled.div`
  border: 0.25rem solid ${({ theme }) => theme.colors.tertiaryLight};
  border-top: 0.25rem solid ${({ theme }) => theme.colors.tertiaryDark};
  border-radius: 50%;
  width: 1rem;
  height: 1rem;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default GlobalStyle;
