import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { Loading } from '../../lib/components/globalstyles';
import useAuth from '../../lib/hooks/useAuth';

export default function CheckoutSuccess() {
  const router = useRouter();
  const { changePlan, refreshUser } = useAuth();
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const load = async () => {
      const sessionId = router.query.session_id as string;

      if (sessionId) {
        try {
          const result = await changePlan(sessionId);
          if (result.statusCode !== 200) {
            throw new Error("Couldn't change plan");
          }
          await refreshUser();
          toast.success('Plano alterado com sucesso!');
          router.push('/app');
        } catch (error) {
          toast.error('Houve um erro');
          setHasError(true);
        }
      }
    };

    load();
  }, [router.query]);

  return (
    <Wrapper>
      {hasError ? (
        <>
          <h3>Erro ao mudar o seu plano</h3>
          <p>
            Envie um e-mail para{' '}
            <a href="mailto:contato@instarank.com.br">
              contato@instarank.com.br
            </a>{' '}
            que iremos te ajudar
          </p>
        </>
      ) : (
        <>
          <h3>Mudando o seu plano...</h3>
          <Loading />
        </>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
`;
