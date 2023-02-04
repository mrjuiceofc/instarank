import styled, { css } from 'styled-components';
import pxToRem from '../utils/pxToRem';
import { Error } from './globalstyles';

type Props = {
  error?: string;
  label?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function TextField(props: Props) {
  const defaultId = props.name || props.id || Date.now().toString();

  return (
    <Wrapper>
      {props.label && <label htmlFor={defaultId}>{props.label}</label>}
      <Input id={defaultId} type="text" {...props} />
      {props.error && (
        <Error
          dangerouslySetInnerHTML={{
            __html: props.error,
          }}
        />
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;

  label {
    font-size: 0.9em;
    line-height: ${({ theme }) => theme.text.detail.lineHeight};
    font-weight: 400;
    color: ${({ theme }) => theme.colors.tertiaryDark};
  }
`;

const Input = styled.input`
  ${({ theme }) => css`
    width: 100%;
    padding: 0.5rem;
    outline: none;
    border: none;
    background-color: ${theme.colors.tertiaryLight};
    border-radius: ${pxToRem(4)};
    color: ${theme.text.paragraph.color};
    font-size: ${theme.text.paragraph.fontSize};
    line-height: ${theme.text.paragraph.lineHeight};
    font-weight: 400;
  `}
`;
