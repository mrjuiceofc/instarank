import Link from 'next/link';
import styled, { css } from 'styled-components';
import useAuth from '../hooks/useAuth';
import useGlobal from '../hooks/useGlobal';
import pxToRem from '../utils/pxToRem';
import { Button } from './Botton';
import { Logo } from './Logo';
import { Tooltip as ReactTooltip } from 'react-tooltip';

export function Header() {
  const { openLoginModal } = useGlobal();
  const { user } = useAuth();

  return (
    <Wrapper>
      <Link href="/">
        <a title="Instarank">
          <Logo showText={false} />
        </a>
      </Link>
      {!user ? (
        <LoginButton title="Fazer login" onClick={() => openLoginModal()}>
          Entrar
        </LoginButton>
      ) : (
        <>
          <LimitParagraph id="monthly-limit">
            {user.monthlyLimit.toLocaleString('pt-BR')}/Mês
          </LimitParagraph>
          <ReactTooltip anchorId="monthly-limit">
            <LimitTooltip>
              <p>
                Esse é o número de vezes que você pode ordenar as postagens de
                algum usuário. Esse número será redefinido todos os meses na
                mesma data em que você fez o seu cadastro.
              </p>
              {user.plan.name === 'free' && (
                <p>
                  Se você quiser aumentar esse limite, você pode fazer uma
                  assinatura mensal.
                </p>
              )}
            </LimitTooltip>
          </ReactTooltip>
        </>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: ${pxToRem(57)};
    width: 100%;
    background: ${theme.colors.tertiaryLight};
    filter: drop-shadow(0px 3px 5px rgba(0, 0, 0, 0.1));
    padding: 0 ${pxToRem(13)};
  `}
`;

const LoginButton = styled(Button)`
  width: ${pxToRem(77)};
  height: ${pxToRem(28.5)};
  font-weight: 400;
  font-size: ${pxToRem(14)};
  border-radius: ${pxToRem(10)};
  text-transform: none;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LimitParagraph = styled.p``;

const LimitTooltip = styled.div`
  max-width: ${pxToRem(200)};
`;
