import React, { useEffect } from 'react';
import styled from 'styled-components';

type Props = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

export default function Modal({ children, isOpen, onClose }: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = React.useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight);
    }
  }, [containerRef.current]);

  return (
    <>
      <Model
        onClick={(e) => {
          const classes = (e.target as any).className.split(' ');
          if (classes.includes('modal-wrapper')) {
            onClose();
          }
        }}
        className="modal-wrapper"
        isOpen={isOpen}
        containerHeight={containerHeight}
      >
        <Container ref={containerRef}>{children}</Container>
      </Model>
    </>
  );
}

const Model = styled.div<{
  isOpen: boolean;
  containerHeight: number;
}>`
  visibility: ${(props) => (props.isOpen ? 'visible' : 'hidden')};
  display: flex;
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: rgba(0, 0, 0, 0.25);
  overflow-y: auto;
  justify-content: center;
  padding-top: ${({ containerHeight }) =>
    containerHeight < 350
      ? 'calc((100vh / 2) - 150px)}'
      : 'calc((100vh / 2) - 195px)'};
  padding-bottom: ${({ containerHeight }) =>
    containerHeight < 350 ? '150px' : '50px'};
`;

const Container = styled.div`
  border-radius: 6.3px;
  padding: 35px 28px;
  background: #ffffff;
  width: 350px;
  height: fit-content;

  @media (max-width: 355px) {
    width: 250px;
  }
`;
