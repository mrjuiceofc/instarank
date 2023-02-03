import React from 'react';
import { Group } from '@jsx-mail/components';
import styled from 'styled-components';
import { Button } from '../components/Botton';

type Props = {
  username: string;
  actionUrl: string;
  amount: number;
  remains: number;
};

export function CompletedOrderTemplate({
  amount,
  username,
  remains,
  actionUrl,
}: Props) {
  return (
    <Container>
      <Body>
        <Group align="center">
          <h1>Ordem concluída</h1>
        </Group>
        <Group align="center">
          <p>
            Esse e-mail é para informar que sua ordem de {amount} seguidores
            para o usuário do Instagram @{username} foi concluída com sucesso.
            Nós garantimos que você irá receber um aumento significativo de
            seguidores na sua conta do Instagram.
          </p>
          {remains && remains > 0 && (
            <p>
              Apenas restaram {remains} seguidores sem ser enviados. Mas não se
              preocupe, essa quantidade voltou ao seu limite mensal e você pode
              fazer outra ordem com ele se quiser.
            </p>
          )}
          <p>
            Não pare de ganhar seguidores e crescer cada vez mais seu Instagram,
            clique no botão abaixo para ver mais detalhes sobre essa ordem e
            fazer outro se quiser:
          </p>
        </Group>
        <GroupButton align="center">
          <Button href={actionUrl}>Ver ordem</Button>
        </GroupButton>
        <Group align="center">
          <p>
            Se você tiver alguma dúvida ou precisar de ajuda, por favor, não
            hesite em responder esse e-mail com ela. Estamos sempre dispostos a
            ajudá-lo(a)
          </p>
          <p>
            Obrigado por escolher o <b>Instarank</b>
          </p>
        </Group>
      </Body>
    </Container>
  );
}

const Container = styled(Group)`
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f7f7f7;
  padding: 10px;
`;

const Body = styled(Group)`
  background-color: #fff;
  padding: 20px;
`;

const GroupButton = styled(Group)`
  padding-top: 20px;
  padding-bottom: 20px;
  width: 100%;
`;
