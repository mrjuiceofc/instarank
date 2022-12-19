import { useRouter } from 'next/router';
import { useEffect } from 'react';
import styled from 'styled-components';
import useAuth from '../lib/hooks/useAuth';
import pxToRem from '../lib/utils/pxToRem';

export default function App() {
  const { user, isLoading } = useAuth();
  const route = useRouter();

  useEffect(() => {
    if (!user && !isLoading) {
      route.push('/');
    }
  }, [user, isLoading]);

  return (
    <Wrapper>
      <p>
        Aqui ficará toda a ferramenta do instarank, e ela está vindo em-breve
      </p>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  text-align: center;
  padding: ${pxToRem(38)};
`;
