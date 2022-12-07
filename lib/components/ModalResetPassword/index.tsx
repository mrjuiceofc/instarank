import styled from 'styled-components';
import Modal from '../Modal';
import { useCallback, useState } from 'react';
import pxToRem from '../../utils/pxToRem';

import SuccessStep from './SuccessStep';
import ModalResetPasswordProvider from './context';
import useModalResetPassword from './hook';
import ResetStep from './ResetStep';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

type PropsContent = {
  isOpen: boolean;
};

export default function ModalResetPassword({
  isOpen,
  onClose: defaultOnClose,
}: Props) {
  return (
    <ModalResetPasswordProvider defaultOnClose={defaultOnClose}>
      <ComponentContent isOpen={isOpen} />
    </ModalResetPasswordProvider>
  );
}

function ComponentContent({ isOpen }: PropsContent) {
  const { onClose, step } = useModalResetPassword();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Wrapper>
        {step === 'success' && <SuccessStep />}
        {step === 'reset' && <ResetStep />}
      </Wrapper>
    </Modal>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${pxToRem(20)};
  width: 100%;
`;
