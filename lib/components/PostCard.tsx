import styled from 'styled-components';
import { InstagramPost } from '../../use-cases/instagram/dto';
import pxToRem from '../utils/pxToRem';
import HeartIcon from '../../assets/heart.svg';
import CommentIcon from '../../assets/comment.svg';
import DownloadIcon from '../../assets/download.svg';
import { useCallback } from 'react';

export function PostCard({ post }: { post: InstagramPost }) {
  const onDownload = useCallback((url: string) => {
    fetch(url).then((response) => {
      response.arrayBuffer().then(function (buffer) {
        const url = window.URL.createObjectURL(new Blob([buffer]));
        const link = document.createElement('a');
        link.href = url;
        link.download = 'post.jpg';
        link.click();
      });
    });
  }, []);

  return (
    <Wrapper>
      <a href={post.igUrl} target="_blank" rel="noreferrer" title="Abir post">
        <Image src={post.images.lowResolution} />
      </a>
      <CardFooter>
        <IconWrapper>
          <img src={HeartIcon.src} alt="Curtidas" />
          <span>{post.likes.toLocaleString('pt-BR')}</span>
        </IconWrapper>
        <IconWrapper>
          <img src={CommentIcon.src} alt="Comentários" />
          <span>{post.comments.toLocaleString('pt-BR')}</span>
        </IconWrapper>
        <IconWrapper>
          <a
            href="javascript:void(0)"
            onClick={(e) => onDownload(post.images.highResolution)}
          >
            <img src={DownloadIcon.src} alt="Baixar post" />
          </a>
        </IconWrapper>
      </CardFooter>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: ${pxToRem(300)};
  height: ${pxToRem(300)};
  border-radius: ${pxToRem(30)};
  position: relative;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
  transition: box-shadow 0.3s ease-in-out;

  &:hover {
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: ${pxToRem(30)};
`;

const CardFooter = styled.div`
  width: 100%;
  height: ${pxToRem(40)};
  background: ${({ theme }) => theme.colors.light};
  border-radius: ${pxToRem(10)} ${pxToRem(10)} ${pxToRem(29)} ${pxToRem(29)};
  position: absolute;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px ${pxToRem(40)};
  gap: ${pxToRem(10)};

  img {
    width: ${pxToRem(25)};
    height: ${pxToRem(25)};
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${pxToRem(5)};
  font-size: ${pxToRem(14)};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
`;
