import React from 'react';
import { Group } from '@jsx-mail/components';
import styled from 'styled-components';

type Props = {
  message: string;
};

export function NotifyAdminBug({ message }: Props) {
  return (
    <Container>
      <Body>
        <Group align="center">
          <h1>BUG URGENTE!</h1>
        </Group>
        <Group align="center">
          <p>
            Olá, essa mensagem serve como um aviso de que aconteceu um bug grave
            no sistema! Por favor arrume o mais rápido possível. Mensagem
            personalizada do bug:
          </p>
        </Group>
        <Group align="center">
          <p>{message}</p>
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
