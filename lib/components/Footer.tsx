import Link from 'next/link';
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
        <Link href="/terms-of-use">
          <a>Termos de Uso</a>
        </Link>
        <Link href="/terms-of-use">
          <a>Políticas de Privacidade</a>
        </Link>
      </FooterStyled>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    height: ${pxToRem(120)};
    width: 100%;
    background: ${theme.colors.tertiaryLight};
  `}
`;

const FooterStyled = styled.footer`
  ${({ theme }) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    font-size: ${theme.text.detail.fontSize};
    line-height: ${theme.text.detail.lineHeight};
    padding: 0 ${pxToRem(20)};
    gap: ${pxToRem(20)};
    text-align: center;
  `}
`;
