import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Loading } from '../lib/components/globalstyles';
import useUser from '../lib/hooks/useUser';
import { toast } from 'react-toastify';

export default function PasswordReset() {
  const [token, setToken] = useState<undefined | string>();
  const router = useRouter();
  const { saveResetPassword } = useUser();

  useEffect(() => {
    const { token } = router.query;
    setToken(token as string);
  }, [router.query]);

  useEffect(() => {
    const load = async () => {
      if (token) {
        const data = await saveResetPassword(token);
        const redirectObject = {
          pathname: '/',
          query: { loginModal: 'true' },
        };

        if (data.statusCode !== 200) {
          delete redirectObject.query;
          toast.error(data.message);
        } else {
          toast.success('Senha alterada com sucesso!');
        }
        router.push(redirectObject);
      }
    };
    load();
  }, [token]);

  return (
    <Wrapper>
      <h3>Salvando a senha nova...</h3>
      <Loading />
    </Wrapper>
  );
}

const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
`;
