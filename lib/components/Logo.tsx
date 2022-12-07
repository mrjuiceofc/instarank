import Image from 'next/image';
import styled, { css } from 'styled-components';
import LogoImage from '../../assets/logo.png';

type Props = {
  showText?: boolean;
  customText?: string;
};

export function Logo({ showText = true, customText = 'Instarank' }: Props) {
  return (
    <Wrapper>
      <Image src={LogoImage} alt="Logo do Instarank" width={40} height={40} />
      {showText && <span>{customText}</span>}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: ${theme.text.subtitle.fontSize};
    color: ${theme.text.subtitle.color};
    line-height: ${theme.text.subtitle.lineHeight};
    font-weight: ${theme.text.subtitle.fontWeight};
  `}
`;
