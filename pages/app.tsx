import { useRouter } from 'next/router';
import { useEffect } from 'react';
import styled from 'styled-components';
import { Button } from '../lib/components/Botton';
import useAuth from '../lib/hooks/useAuth';
import useGlobal from '../lib/hooks/useGlobal';
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
  const { user, isLoading, changePlan } = useAuth();
  const route = useRouter();

  useEffect(() => {
    if (!user && !isLoading) {
      route.push('/');
    }
  }, [user, isLoading]);

  return (
    <Wrapper>
      {user && user.plan.name === 'free' && (
        <FloatButton onClick={() => changePlan(premiumPlan.name)}>
          ganhe {premiumPlan.monthlyLimit.toLocaleString('pt-BR')} ordens
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
