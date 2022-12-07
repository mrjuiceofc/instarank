import styled from 'styled-components';
import { Paragraph, SmallTitle } from '../globalstyles';

export default function SuccessStep() {
  return (
    <Wrapper>
      <SmallTitle margin="0 0 6px 0">E-mail enviado!</SmallTitle>
      <Paragraph margin="0" textAlign="center">
        Caso o endereço de e-mail que você informou esteja certo, ele vai
        receber um e-mail com um botão. Basta clicar no link que foi enviado e a
        senha que você digitou será salva.
      </Paragraph>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0px;
`;
