import React from 'react';
import { Group } from '@jsx-mail/components';
import styled from 'styled-components';
import { Button } from '../components/Botton';

type Props = {
  planName: string;
  actionUrl: string;
  amount: number;
};

export function PaidUser({ planName, actionUrl, amount }: Props) {
  return (
    <Container>
      <Body>
        <Group align="center">
          <h1>Agora você é {planName}</h1>
        </Group>
        <Group align="center">
          <p>
            O seu pagamento foi confirmado e você se tornou um usuário{' '}
            {planName}, com isso você passa a ter acesso a{' '}
            {Number(amount).toLocaleString('pt-BR')} seguidores todos os meses!
          </p>
          <p>
            Não perca tempo, click no botão abaixo e use os seus seguidores para
            qualquer usuário público do Instagram que você quiser!
          </p>
        </Group>
        <GroupButton align="center">
          <Button href={actionUrl}>Usar meus seguidores</Button>
        </GroupButton>
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
