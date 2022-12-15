import styled, { css } from 'styled-components';
import useGlobal from '../hooks/useGlobal';
import pxToRem from '../utils/pxToRem';
import { Button } from './Botton';

type Props = {
  planName: string;
  planPrice: number;
  planMonthlyLimit: number;
};

export function PlanCard({ planName, planMonthlyLimit, planPrice }: Props) {
  const { openCreateUserModal } = useGlobal();

  return (
    <Wrapper>
      <Title>{planName}</Title>
      <p>
        Ordene até {planMonthlyLimit.toLocaleString('pt-BR')} vezes por mês!
      </p>
      <Subtitle>
        {(planPrice / 100).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}
        /Mês
      </Subtitle>
      <Button
        variant={planName === 'premium' ? 'gradient' : 'outline'}
        onClick={() => openCreateUserModal(planName)}
      >
        {planPrice === 0 ? 'usar grátis' : 'Experimente agora'}
      </Button>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: ${pxToRem(320)};
    padding: ${pxToRem(15)};
    text-transform: capitalize;
    background: ${theme.colors.light};
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    text-align: center;
  `}
`;

const Title = styled.h1`
  margin: 0px;
`;

const Subtitle = styled.h2`
  margin: 0 0 ${pxToRem(15)} 0;
`;
