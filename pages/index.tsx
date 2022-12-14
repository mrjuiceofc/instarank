import Head from 'next/head';
import Image from 'next/image';
import styled, { css } from 'styled-components';
import PhonesImage from '../assets/phones.png';
import { Button } from '../lib/components/Botton';
import { Paragraph } from '../lib/components/globalstyles';
import useGlobal from '../lib/hooks/useGlobal';
import pxToRem from '../lib/utils/pxToRem';

export default function Home() {
  const { openCreateUserModal } = useGlobal();

  return (
    <div>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Esta ferramenta ordena os posts de uma conta do Instagram em ordem de curtidas ou comentários para analisar quais publicações estão tendo maior engajamento dos usuários"
        />
        <title>
          Descubra qual a publicação mais engajada do seu concorrente |
          Instarank
        </title>
      </Head>
      <Wrapper>
        <WrapperAbout>
          <WrapperText>
            <Title>
              Descubra qual a publicação mais engajada do seu concorrente.
            </Title>
            <StyledParagraph margin="0 0 30px 0">
              Esta ferramenta ordena os posts de uma conta do Instagram em ordem
              de curtidas ou comentários para analisar quais publicações estão
              tendo maior engajamento dos usuários.
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
      </Wrapper>
    </div>
  );
}

const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const WrapperAbout = styled.div`
  display: flex;
  justify-content: center;
  padding: ${pxToRem(38)} ${pxToRem(53)} 0 ${pxToRem(53)};
  flex-wrap: wrap;
  width: 100%;

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
      font-size: ${pxToRem(20)};
      line-height: ${pxToRem(28)};
      margin-bottom: ${pxToRem(20)};
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
