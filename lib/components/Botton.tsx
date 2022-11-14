import styled, { css } from 'styled-components';
import pxToRem from '../utils/pxToRem';

type Props = {
  variant: 'gradient' | 'outline';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button(props: Props) {
  return <StyledButton {...props}>{props.children}</StyledButton>;
}

const StyledButton = styled.button<Props>`
  ${({ theme, variant }) => css`
    padding: ${pxToRem(8)};
    border-radius: ${pxToRem(6)};
    width: 100%;
    text-transform: uppercase;
    font-size: ${theme.text.paragraph.fontSize};
    line-height: ${theme.text.paragraph.lineHeight};
    font-weight: 500;

    ${variant === 'gradient' &&
    css`
      background: ${theme.colors.gradient};
      color: ${theme.colors.tertiaryLight};
      outline: none;
      border: none;
    `}

    ${variant === 'outline' &&
    css`
      background: none;
      color: ${theme.colors.secondary};
      outline: none;
      border: 1px solid ${theme.colors.secondary};
    `}
  `};
`;
