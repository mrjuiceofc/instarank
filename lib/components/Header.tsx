import Link from 'next/link';
import styled, { css } from 'styled-components';
import useUser from '../hooks/useUser';
import useGlobal from '../hooks/useGlobal';
import pxToRem from '../utils/pxToRem';
import { Button } from './Botton';
import { Logo } from './Logo';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export function Header() {
  const { openLoginModal } = useGlobal();
  const { user } = useUser();
  const [limitResetDate, setLimitResetDate] = useState<Date | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    const lastResetDate = new Date(user.limitResetAt);
    const nextResetDate = new Date(
      lastResetDate.setMonth(lastResetDate.getMonth() + 1)
    );
    setLimitResetDate(nextResetDate);
  }, [user]);

  return (
    <Wrapper>
      <Link href="/">
        <a title="Instarank">
          <Logo showText={false} />
        </a>
      </Link>
      {!user && (
        <LoginButton title="Fazer login" onClick={() => openLoginModal()}>
          Entrar
        </LoginButton>
      )}
      {user && router.pathname === '/' && (
        <Link href="/app">
          <a title="Ir para o painel">
            <LoginButton title="Ir para o painel">Painel</LoginButton>
          </a>
        </Link>
      )}
      {user && router.pathname !== '/' && (
        <>
          <LimitParagraph id="monthly-limit">
            Restante: {user.monthlyLimit.toLocaleString('pt-BR')}
          </LimitParagraph>
          <ReactTooltip anchorId="monthly-limit">
            <LimitTooltip>
              <p>
                Este é o número de seguidores que você pode distribuir para quem
                quiser. Este número será redefinido com base no seu plano a cada
                30 dias, isso está previsto para ocorrer em{' '}
                {limitResetDate?.toLocaleDateString('pt-BR')}
              </p>
              {user.plan.name === 'free' && (
                <p>
                  Se você quiser aumentar esse número de seguidores, você pode
                  fazer uma assinatura mensal.
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${pxToRem(57)};
  width: 100%;
  padding: ${pxToRem(38)} ${pxToRem(53)} 0 ${pxToRem(53)};
  margin-bottom: ${pxToRem(30)};

  @media (max-width: 1005px) {
    padding: ${pxToRem(38)} ${pxToRem(15)} 0 ${pxToRem(15)};
    margin-bottom: ${pxToRem(20)};
  }
`;

const LoginButton = styled(Button)`
  width: ${pxToRem(170)};
`;

const LimitParagraph = styled.p``;

const LimitTooltip = styled.div`
  max-width: ${pxToRem(200)};
`;
