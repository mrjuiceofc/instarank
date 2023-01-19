import Link from 'next/link';
import styled, { css } from 'styled-components';
import useAuth from '../hooks/useAuth';
import useGlobal from '../hooks/useGlobal';
import pxToRem from '../utils/pxToRem';
import { Button } from './Botton';
import { Logo } from './Logo';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { useEffect, useState } from 'react';

export function Header() {
  const { openLoginModal } = useGlobal();
  const { user, isLoading } = useAuth();
  const [logoRedirectPath, setLogoRedirectPath] = useState('/');
  const [limitResetDate, setLimitResetDate] = useState<Date | null>(null);

  useEffect(() => {
    if (user && !isLoading) {
      setLogoRedirectPath('/app');
    }
  }, [user, isLoading]);

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
      <Link href={logoRedirectPath}>
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
            Restante: {user.monthlyLimit.toLocaleString('pt-BR')}
          </LimitParagraph>
          <ReactTooltip anchorId="monthly-limit">
            <LimitTooltip>
              <p>
                Este é o número de postagens que você pode ordenar por mês. Este
                número será redefinido com base no seu plano a cada 30 dias,
                isso está previsto para ocorrer em{' '}
                {limitResetDate?.toLocaleDateString('pt-BR')}
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
