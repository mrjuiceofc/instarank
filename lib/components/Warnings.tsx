import { useCallback, useEffect, useState } from 'react';
import useUser from '../hooks/useUser';
import type { warning } from '@prisma/client';
import Modal from './Modal';
import { SmallTitle } from './globalstyles';
import styled from 'styled-components';
import { Button } from './Botton';
import { toast } from 'react-toastify';

type LoadingAction = {
  warningId: string;
  action: 'read_only' | 'read_redirect';
};

export function Warnings() {
  const { user, getWarnings, readWarning } = useUser();
  const [warnings, setWarnings] = useState<warning[]>([]);
  const [loadingAction, setLoadingAction] = useState<LoadingAction | null>(
    null
  );

  useEffect(() => {
    if (!user) return;

    const fetchWarnings = async () => {
      const data = await getWarnings();
      if (data.statusCode !== 200) {
        console.log('[WARNINGS] Error fetching warnings', data);
        return;
      }

      setWarnings(data.warnings);
    };

    fetchWarnings();
  }, [user]);

  const actionWarning = useCallback(
    async (warning: warning, redirect: boolean) => {
      setLoadingAction({
        warningId: warning.id,
        action: redirect ? 'read_redirect' : 'read_only',
      });
      const data = await readWarning(warning.id);

      setLoadingAction(null);

      if (data.statusCode !== 200) {
        toast.error('Erro ao marcar aviso como lido');
        return;
      }

      setWarnings((warnings) => {
        return warnings.filter((w) => w.id !== warning.id);
      });

      if (redirect) {
        window.location.href = warning.actionUrl;
      }
    },
    []
  );

  return (
    <>
      <Modal isOpen={warnings.length > 0} onClose={() => setWarnings([])}>
        <WarningsWrapper>
          {warnings.map((warning) => (
            <Warning key={warning.id}>
              <SmallTitle>{warning.title}</SmallTitle>
              <Message>{warning.message}</Message>
              <ButtonWrapper>
                {warning.actionUrl && warning.actionText && (
                  <Button
                    isLoading={
                      loadingAction?.warningId === warning.id &&
                      loadingAction?.action === 'read_redirect'
                    }
                    isDisabled={
                      loadingAction?.warningId === warning.id &&
                      loadingAction?.action === 'read_redirect'
                    }
                    onClick={() => actionWarning(warning, true)}
                  >
                    {warning.actionText}
                  </Button>
                )}
                <Button
                  variant="outline"
                  isLoading={
                    loadingAction?.warningId === warning.id &&
                    loadingAction?.action === 'read_only'
                  }
                  isDisabled={
                    loadingAction?.warningId === warning.id &&
                    loadingAction?.action === 'read_only'
                  }
                  onClick={() => actionWarning(warning, false)}
                >
                  Não mostrar novamente
                </Button>
              </ButtonWrapper>
              <Divider />
            </Warning>
          ))}
        </WarningsWrapper>
      </Modal>
    </>
  );
}

const WarningsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;

  p {
    margin: 5px 0;
  }
`;

const Warning = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
  gap: 10px;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.tertiary};
  margin: 10px 0;
`;

const Message = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.tertiaryDark};
  line-height: 1.2rem;
  text-align: center;
`;
