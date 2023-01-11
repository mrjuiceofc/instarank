import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { Loading } from '../../lib/components/globalstyles';
import useAuth from '../../lib/hooks/useAuth';
import prisma from '../../lib/prisma';

type Props = {
  premiumPlan: {
    id: string;
    name: string;
    price: number;
    monthlyLimit: number;
  };
};

export default function CheckoutSuccess({ premiumPlan }: Props) {
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
          <p>
            O pagamento de{' '}
            {(premiumPlan.price / 100).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}{' '}
            foi feito com sucesso, agora estamos mudando o seu plano para{' '}
            {premiumPlan.name}...
          </p>
          <Loading />
        </>
      )}
    </Wrapper>
  );
}

export async function getStaticProps() {
  const plan = await prisma.plan.findFirst({
    where: {
      deletedAt: null,
      name: 'premium',
    },
  });

  return {
    props: {
      premiumPlan: {
        id: plan.id,
        name: plan.name,
        price: plan.price,
        monthlyLimit: plan.monthlyLimit,
      },
    },
  };
}

const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
`;
