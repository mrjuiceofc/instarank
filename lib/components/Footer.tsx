import styled, { css } from 'styled-components';
import pxToRem from '../utils/pxToRem';

export default function Footer() {
  return (
    <Wrapper>
      <FooterStyled>
        <p>
          suporte:{' '}
          <a href="mailto:contato@instarank.com.br">contato@instarank.com.br</a>
        </p>
      </FooterStyled>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
`;

const FooterStyled = styled.footer`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    height: ${pxToRem(57)};
    width: 100%;
    background: ${theme.colors.tertiaryLight};
  `}
`;
