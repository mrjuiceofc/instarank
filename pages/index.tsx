import Head from 'next/head';
import Image from 'next/image';
import styled, { css } from 'styled-components';
import PhonesImage from '../assets/phones.png';
import { Button } from '../lib/components/Botton';
import { Paragraph } from '../lib/components/globalstyles';
import { PlanCard } from '../lib/components/PlanCard';
import useGlobal from '../lib/hooks/useGlobal';
import pxToRem from '../lib/utils/pxToRem';
import prisma from '../lib/prisma';
import { useEffect } from 'react';
import useUser from '../lib/hooks/useUser';
import { useRouter } from 'next/router';
import { feedbacks } from '../lib/mocks/feedbacks';

type Props = {
  plans: {
    id: string;
    name: string;
    price: number;
    monthlyLimit: number;
  }[];
};

export default function Home({ plans }: Props) {
  const { openCreateUserModal } = useGlobal();
  const { user, isLoading } = useUser();
  const route = useRouter();

  useEffect(() => {
    if (user && !isLoading) {
      route.push('/app');
    }
  }, [user, isLoading]);

  return (
    <div>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Aumente sua base de seguidores no Instagram com nossa ferramenta de seguidores, escolha a quantidade desejada sem limitações e deixe que cuidemos disso por você. Experimente agora e veja a diferença na sua presença online!"
        />
        <title>
          10 mil seguidores extras todo mês no Instagram | Instarank
        </title>
      </Head>
      <Wrapper>
        <WrapperAbout>
          <WrapperText>
            <Title>10 mil seguidores extras todo mês no Instagram</Title>
            <StyledParagraph>
              Aumente sua base de seguidores no Instagram com nossa ferramenta
              de seguidores, escolha a quantidade desejada sem limitações e
              deixe que cuidemos disso por você. Experimente agora e veja a
              diferença na sua presença online!
            </StyledParagraph>
            <WrapperButton>
              <Button onClick={() => openCreateUserModal('free')}>
                Começar GRATUITAMENTE
              </Button>
            </WrapperButton>
          </WrapperText>
          <StyledImage>
            <Image src={PhonesImage} alt="Imagem de um perfil no Instagram" />
          </StyledImage>
        </WrapperAbout>
        <FirstSection>
          <WrapperSectionTitle>
            <Title>Mais de 25.000 usuários satisfeitos </Title>
          </WrapperSectionTitle>
          <WrapperFeedbacks>
            {feedbacks.map((feedback) => (
              <Feedback key={feedback.name}>
                <div>
                  <div>
                    <img src={feedback.imgSrc} alt={feedback.name} />
                    <span>{feedback.name}</span>
                  </div>
                  <p>{feedback.message}</p>
                </div>
              </Feedback>
            ))}
          </WrapperFeedbacks>
        </FirstSection>
        <Section>
          <WrapperSectionTitle>
            <Title>Encontre o plano certo para você</Title>
          </WrapperSectionTitle>
          <WrapperPlans>
            {plans.map((plan) => (
              <PlanCard
                planName={plan.name}
                planMonthlyLimit={plan.monthlyLimit}
                planPrice={plan.price}
                key={plan.id}
              />
            ))}
          </WrapperPlans>
        </Section>
      </Wrapper>
    </div>
  );
}

export async function getStaticProps() {
  const plans = await prisma.plan.findMany({
    where: {
      deletedAt: null,
    },
    orderBy: {
      price: 'asc',
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
    revalidate: 10,
  };
}

const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  width: 100%;
  z-index: 0;
  margin-bottom: ${pxToRem(100)};
`;

const WrapperAbout = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  padding: ${pxToRem(38)} ${pxToRem(53)} 0 ${pxToRem(53)};

  @media (max-width: 1005px) {
    padding: ${pxToRem(38)} ${pxToRem(15)} 0 ${pxToRem(15)};
  }
`;

const WrapperText = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${pxToRem(58)};
  max-width: ${pxToRem(600)};

  @media (max-width: 1265px) {
    max-width: ${pxToRem(500)};
  }

  @media (max-width: 1105px) {
    max-width: ${pxToRem(400)};
  }

  @media (max-width: 1005px) {
    align-items: center;
    text-align: center;
    max-width: 100%;
    margin: 0;
  }
`;

const Title = styled.h1`
  ${({ theme }) => css`
    font-size: ${theme.text.title.fontSize};
    line-height: ${theme.text.title.lineHeight};
    color: ${theme.text.title.color};
    font-weight: ${theme.text.title.fontWeight};
    margin: 0;
    padding: 0;

    @media (max-width: 1265px) {
      font-size: ${pxToRem(30)};
      line-height: ${pxToRem(40)};
    }

    @media (max-width: 1105px) {
      font-size: ${pxToRem(24)};
      line-height: ${pxToRem(32)};
    }

    @media (max-width: 1005px) {
      font-size: ${pxToRem(25)};
      line-height: ${pxToRem(35)};
    }
  `}
`;

const StyledParagraph = styled(Paragraph)`
  @media (max-width: 1165px) {
    font-size: ${pxToRem(14)};
    line-height: ${pxToRem(20)};
  }
`;

const WrapperButton = styled.div`
  width: ${pxToRem(290)};

  @media (max-width: 1165px) {
    width: 250px;
    margin-bottom: ${pxToRem(30)};
  }
`;

const StyledImage = styled.span`
  & > span {
    width: 615px !important;
    height: 575px !important;
    object-fit: cover !important;
    z-index: -1 !important;

    @media (max-width: 1330px) {
      width: 560px !important;
      height: 520px !important;
    }

    @media (max-width: 1165px) {
      width: 500px !important;
      height: 460px !important;
    }

    @media (max-width: 1165px) {
      width: 100% !important;
      height: auto !important;
    }
  }
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: ${pxToRem(20)};
`;

const FirstSection = styled(Section)`
  margin-top: -90px;

  @media (max-width: 728px) {
    margin-top: -40px;
  }
`;

const WrapperSectionTitle = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  padding: 0 ${pxToRem(50)};
`;

const WrapperFeedbacks = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${pxToRem(30)};
  width: 100%;
  flex-wrap: wrap;
  padding: 0 ${pxToRem(53)} ${pxToRem(100)} ${pxToRem(53)};
  max-width: ${pxToRem(1500)};

  @media (max-width: 1005px) {
    padding: 0 ${pxToRem(15)} ${pxToRem(80)} ${pxToRem(15)};
  }
`;

const Feedback = styled.div`
  ${({ theme }) => css`
    background: ${theme.colors.gradient};
    padding: ${pxToRem(1)};
    border-radius: ${pxToRem(6)};
    width: ${pxToRem(500)};

    @media (max-width: 700px) {
      width: 100%;
    }

    div {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: ${pxToRem(5)};
      background: ${theme.colors.light};
      padding: ${pxToRem(10)};
      border-radius: ${pxToRem(6)};
      width: 100%;
      height: 100%;

      div {
        display: flex;
        align-items: center;
        flex-direction: row;
        gap: ${pxToRem(10)};
        width: 100%;

        img {
          width: ${pxToRem(50)};
          height: ${pxToRem(50)};
          border-radius: 50%;
          object-fit: cover;
        }

        span {
          font-size: ${pxToRem(14)};
          font-weight: 500;
        }
      }

      p {
        margin: 0px;
      }
    }
  `};
`;

const WrapperPlans = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${pxToRem(30)};
  flex-wrap: wrap;
  padding: 0 ${pxToRem(50)};

  @media (max-width: 728px) {
    padding: 0 ${pxToRem(25)};
  }
`;
