import React from 'react';
import styled from 'styled-components';
import { Button as JsxButton } from '@jsx-mail/components';

export function Button({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return <StyledButton href={href}>{children}</StyledButton>;
}

const StyledButton = styled(JsxButton)`
  padding: 8px;
  width: 100%;
  text-transform: uppercase;
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
  background: none;
  color: #1877f2;
  border: 1px solid #1877f2;
`;
