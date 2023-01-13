import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { Loading } from '../../lib/components/globalstyles';
import useAuth from '../../lib/hooks/useAuth';
import prisma from '../../lib/prisma';
import * as gtag from '../../lib/gtag';

type plan = {
  id: string;
  name: string;
  price: number;
  monthlyLimit: number;
};

type Props = {
  plans: plan[];
};

export default function CheckoutSuccess({ plans }: Props) {
  const router = useRouter();
  const { changePlan, refreshUser } = useAuth();
  const [hasError, setHasError] = useState(false);
  const [paidPlan, setPaidPlan] = useState<plan | null>(null);

  useEffect(() => {
    const load = async () => {
      const sessionId = router.query.session_id as string;

      if (sessionId) {
        try {
          const result = await changePlan(sessionId);
          if (result.statusCode !== 200) {
            throw new Error("Couldn't change plan");
          }
          gtag.event({
            action: 'purchase',
            category: 'User',
            label: 'Purchase Plan',
            value: result.plan.price,
          });
          await refreshUser();
          toast.success('Plano alterado com sucesso!');
          router.push('/app');
        } catch (error) {
          toast.error('Houve um erro');
          setHasError(true);
        }
      }
    };

    const foundPlan = plans.find((plan) => plan.name === router.query.plan);
    setPaidPlan(foundPlan);

    load();
  }, [router.query, plans]);

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
          {paidPlan && (
            <>
              <h3>Mudando o seu plano...</h3>
              <p>
                O pagamento de{' '}
                <span>
                  {(paidPlan.price / 100).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </span>{' '}
                foi feito com sucesso, agora estamos mudando o seu plano para{' '}
                {paidPlan.name}...
              </p>
            </>
          )}
          <Loading />
        </>
      )}
    </Wrapper>
  );
}

export async function getStaticProps() {
  const plans = await prisma.plan.findMany({
    where: {
      deletedAt: null,
    },
  });

  return {
    props: {
      plans: plans.map((plan) => ({
        id: plan.id,
        name: plan.name,
        price: plan.price,
        monthlyLimit: plan.monthlyLimit,
      })),
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
