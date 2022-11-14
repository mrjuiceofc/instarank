import styled, { css } from 'styled-components';
import pxToRem from '../utils/pxToRem';
import { Error } from './globalstyles';

type Props = {
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function TextField(props: Props) {
  return (
    <Wrapper>
      <Input type="text" {...props} />
      {props.error && <Error>{props.error}</Error>}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
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
