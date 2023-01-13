import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { Button } from '../lib/components/Botton';
import useAuth from '../lib/hooks/useAuth';
import prisma from '../lib/prisma';
import pxToRem from '../lib/utils/pxToRem';

type Props = {
  premiumPlan: {
    id: string;
    name: string;
    price: number;
    monthlyLimit: number;
  };
};

export default function App({ premiumPlan }: Props) {
  const { user, isLoading, requestChangePlan } = useAuth();
  const route = useRouter();

  const onChangePlan = useCallback(async () => {
    await requestChangePlan(premiumPlan.name);
  }, [premiumPlan]);

  useEffect(() => {
    if (!user && !isLoading) {
      route.push('/');
    }
  }, [user, isLoading]);

  return (
    <Wrapper>
      {user && user.plan.name === 'free' && (
        <FloatButton isLoading={isLoading} onClick={() => onChangePlan()}>
          Ordene até {premiumPlan.monthlyLimit.toLocaleString('pt-BR')}{' '}
          postagens
        </FloatButton>
      )}
      <p>
        Aqui ficará toda a ferramenta do instarank, e ela está vindo em-breve
      </p>
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

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  text-align: center;
  padding: ${pxToRem(38)};
`;

const FloatButton = styled(Button)`
  position: fixed;
  max-width: ${pxToRem(211)};
  left: ${pxToRem(6)};
  bottom: ${pxToRem(6)};
  filter: drop-shadow(4px 4px 4px rgba(0, 0, 0, 0.25));
`;
