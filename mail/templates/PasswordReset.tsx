import React from 'react';
import { Group } from '@jsx-mail/components';
import styled from 'styled-components';
import { Button } from '../components/Botton';

type Props = {
  url: string;
};

export function PasswordResetTemplate({ url }: Props) {
  return (
    <Container>
      <Body>
        <Group align="center">
          <h1>Redefinir senha</h1>
        </Group>
        <Group align="center">
          <p>
            Caso você tenha solicitada uma redefinição de senha por favor click
            no botão abaixo que automaticamente a senha que você digitou será
            definida como a sua padrão. Caso você não tenha solicitado a
            redefinição de senha por favor ignore este email e NÃO click no
            botão abaixo.
          </p>
        </Group>
        <GroupButton align="center">
          <Button href={url}>Redefinir senha</Button>
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
`;
