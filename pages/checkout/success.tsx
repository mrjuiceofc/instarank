import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { Loading } from '../../lib/components/globalstyles';
import useUser from '../../lib/hooks/useUser';
import prisma from '../../lib/prisma';
import pxToRem from '../../lib/utils/pxToRem';
import { Button } from '../../lib/components/Botton';
import Link from 'next/link';

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
  const [paidPlan, setPaidPlan] = useState<plan | null>(null);

  useEffect(() => {
    const foundPlan = plans.find((plan) => plan.name === router.query.plan);
    setPaidPlan(foundPlan);
  }, [router.query, plans]);

  return (
    <Wrapper>
      {paidPlan && (
        <>
          <h3>Parabéns!!</h3>
          <p>
            O pagamento de{' '}
            <span>
              {(paidPlan.price / 100).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </span>{' '}
            foi feito com sucesso e agora você tem{' '}
            {paidPlan.monthlyLimit.toLocaleString('pt-BR')} seguidores todos os
            meses!
          </p>
          <Link
            href="/app"
            style={{
              width: '100%',
            }}
          >
            <a
              style={{
                width: '80%',
              }}
            >
              <Button>Usar meus seguidores</Button>
            </a>
          </Link>
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
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  min-height: calc(100vh - 100px);
  text-align: center;
  padding: 0 ${pxToRem(15)};

  h3 {
    font-size: ${pxToRem(20)};
    margin: 0;
  }
`;

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
