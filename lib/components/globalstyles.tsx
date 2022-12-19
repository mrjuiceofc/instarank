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
    height: 100%;
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

// text styles
type TextProps = {
  margin?: string;
  textAlign?: 'center' | 'left' | 'right';
};

export const Error = styled.span<TextProps>`
  ${({ theme, margin, textAlign }) => css`
    color: ${theme.text.error.color};
    font-size: ${theme.text.error.fontSize};
    line-height: ${theme.text.error.lineHeight};
    font-weight: ${theme.text.error.fontWeight};
    ${margin && `margin: ${margin};`}
    ${textAlign && `text-align: ${textAlign};`}
  `}
`;

export const SmallTitle = styled.p<TextProps>`
  ${({ theme, margin, textAlign }) => css`
    font-size: ${theme.text.smallTitle.fontSize};
    line-height: ${theme.text.smallTitle.lineHeight};
    color: ${theme.text.smallTitle.color};
    font-weight: ${theme.text.smallTitle.fontWeight};
    ${margin && `margin: ${margin};`}
    ${textAlign && `text-align: ${textAlign};`}
  `}
`;

export const Paragraph = styled.p<TextProps>`
  ${({ theme, margin, textAlign }) => css`
    font-size: ${theme.text.paragraph.fontSize};
    line-height: ${theme.text.paragraph.lineHeight};
    color: ${theme.text.paragraph.color};
    font-weight: ${theme.text.paragraph.fontWeight};
    ${margin && `margin: ${margin};`}
    ${textAlign && `text-align: ${textAlign};`}
  `}
`;

export default GlobalStyle;
