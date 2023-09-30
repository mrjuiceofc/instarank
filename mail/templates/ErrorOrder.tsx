import React from 'react';
import { Group } from '@jsx-mail/components';
import styled from 'styled-components';
import { Button } from '../components/Botton';

type Props = {
  username: string;
  actionUrl: string;
  amount: number;
};

export function ErrorOrder({ amount, username, actionUrl }: Props) {
  return (
    <Container>
      <Body>
        <Group align="center">
          <h1>Erro na Ordem</h1>
        </Group>
        <Group align="center">
          <p>
            Esse e-mail é para informar que houve um erro na entrega da sua
            ordem de {amount} seguidores para o usuário do Instagram @{username}
            . Isso geralmente ocorre quando o usuário do Instagram não existe ou
            não é um usuário público
          </p>
          <p>
            Não se preocupe, a quantidade de seguidores foi devolvida para a sua
            conta, você pode acessar sua conta clicando no botão abaixo e usar a
            quantidade que foi cancelada pela ordem
          </p>
        </Group>
        <GroupButton align="center">
          <Button href={actionUrl}>Acessar conta</Button>
        </GroupButton>
        <Group align="center">
          <p>
            Se você tentar novamente com um usuário público e com o nome de
            usuário correto e ainda assim tiver um erro, não se excite em
            responder esse e-mail nos relatando esse problema e nossa equipe vai
            te ajudar!
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
