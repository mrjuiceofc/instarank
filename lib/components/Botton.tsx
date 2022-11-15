import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import pxToRem from '../utils/pxToRem';
import { Loading } from './globalstyles';

type Props = {
  variant?: 'gradient' | 'outline';
  isLoading?: boolean;
  isDisabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button(props: Props) {
  const [newProps, setNewProps] = useState(props);

  useEffect(() => {
    setNewProps(props);
  }, [props]);

  useEffect(() => {
    if (newProps.isLoading) {
      setNewProps((old) => ({ ...old, isDisabled: true }));
    } else {
      setNewProps((old) => ({ ...old, isDisabled: false }));
    }
  }, [newProps.isLoading]);

  useEffect(() => {
    if (!newProps.variant) {
      setNewProps((old) => ({ ...old, variant: 'gradient' }));
    }
  }, [newProps.variant]);

  return (
    <StyledButton {...newProps}>
      {newProps.isLoading ? <Loading /> : newProps.children}
    </StyledButton>
  );
}

const StyledButton = styled.button<Props>`
  ${({ theme, variant, isDisabled }) => css`
    padding: ${pxToRem(8)};
    border-radius: ${pxToRem(6)};
    width: 100%;
    text-transform: uppercase;
    font-size: ${theme.text.paragraph.fontSize};
    line-height: ${theme.text.paragraph.lineHeight};
    font-weight: 500;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    ${isDisabled &&
    css`
      pointer-events: none;
      opacity: 0.5;
    `}

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
