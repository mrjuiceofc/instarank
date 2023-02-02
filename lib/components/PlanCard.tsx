import styled, { css } from 'styled-components';
import useGlobal from '../hooks/useGlobal';
import pxToRem from '../utils/pxToRem';
import { Button } from './Botton';
import CheckIconImg from '../../assets/check-icon.svg';

type Props = {
  planName: string;
  planPrice: number;
  planMonthlyLimit: number;
} & React.HTMLAttributes<HTMLDivElement>;

export function PlanCard(props: Props) {
  const { openCreateUserModal } = useGlobal();
  const { planName, planPrice, planMonthlyLimit, ...rest } = props;

  return (
    <Wrapper {...props}>
      <WrapperTitles {...props}>
        <Title>{planName}</Title>
        {planName === 'free' && <p>Ganhe seguidores grátis todos os meses</p>}
        {planName === 'premium' && (
          <p>Experimente o poder de infinitas possibilidades</p>
        )}
        <Price>
          <span>R$</span>
          {(planPrice / 100)
            .toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })
            .replace('R$', '')}
        </Price>
      </WrapperTitles>
      <WrapperFeatures>
        <Feature>
          <img src={CheckIconImg.src} alt="Incluído" />
          <p>
            Até {planMonthlyLimit.toLocaleString('pt-BR')} seguidores todo mês
          </p>
        </Feature>
        {planName === 'premium' && (
          <>
            <Feature>
              <img src={CheckIconImg.src} alt="Incluído" />
              <p>Todas as funcionalidades do Free</p>
            </Feature>
            <Feature>
              <img src={CheckIconImg.src} alt="Incluído" />
              <p>Suporte por e-mail</p>
            </Feature>
            <Feature>
              <img src={CheckIconImg.src} alt="Incluído" />
              <p>Perfil crescendo todos os meses</p>
            </Feature>
            <Feature>
              <img src={CheckIconImg.src} alt="Incluído" />
              <p>Cancele quando quiser</p>
            </Feature>
          </>
        )}
        {planName === 'free' && (
          <>
            <Feature>
              <img src={CheckIconImg.src} alt="Incluído" />
              <p>Acesso de qualquer dispositivo</p>
            </Feature>
            <Feature>
              <img src={CheckIconImg.src} alt="Incluído" />
              <p>Disponível 24 horas por dia</p>
            </Feature>
            <Feature>
              <img src={CheckIconImg.src} alt="Incluído" />
              <p>Qualquer usuário publico</p>
            </Feature>
            <Feature>
              <img src={CheckIconImg.src} alt="Incluído" />
              <p>Distribua os seguidores como quiser</p>
            </Feature>
          </>
        )}
        <Button
          variant={planName === 'premium' ? 'gradient' : 'outline'}
          onClick={() => openCreateUserModal(planName)}
        >
          {planPrice === 0 ? 'usar grátis' : 'Experimente agora'}
        </Button>
      </WrapperFeatures>
    </Wrapper>
  );
}

const Wrapper = styled.div<Props>`
  ${({ theme, planName }) => css`
    width: ${pxToRem(400)};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: ${pxToRem(20)};
    border-radius: ${pxToRem(20)};

    ${planName === 'premium' &&
    css`
      background: ${theme.colors.gradient};
    `}
    ${planName === 'free' &&
    css`
      background: ${theme.colors.tertiaryLight};
    `}

    @media (max-width: 768px) {
      width: 100%;
    }
  `}
`;

const WrapperTitles = styled.div<Props>`
  ${({ theme, planName }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: ${pxToRem(200)};
    gap: ${pxToRem(8)};

    ${planName === 'premium' &&
    css`
      color: #fff;
    `}

    p {
      font-size: ${theme.text.smallTitle.fontSize};
      line-height: ${theme.text.smallTitle.lineHeight};
      font-weight: ${theme.text.smallTitle.fontWeight};
    }
  `};
`;

const Title = styled.h1`
  margin: 0px;
  text-transform: capitalize;
  font-weight: 500;
`;

const Price = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${pxToRem(40)};
  font-weight: 600;

  span {
    font-size: ${pxToRem(20)};
  }
`;

const WrapperFeatures = styled.div`
  width: 100%;
  background: #ffffff;
  padding: ${pxToRem(23)};
  border-radius: ${pxToRem(8)};
  margin-top: ${pxToRem(30)};
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin: 0 0 ${pxToRem(15)} 0;
  gap: ${pxToRem(10)};

  p {
    margin: 0px;
    font-weight: 500;
    text-align: left;
    font-size: ${pxToRem(14)};
  }

  img {
    width: ${pxToRem(25)};
    height: ${pxToRem(25)};
  }
`;
