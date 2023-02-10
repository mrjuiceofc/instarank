import styled, { css } from 'styled-components';

export default function TermsOfUse() {
  return (
    <Wrapper>
      <Title>Termos de Uso e Políticas de Privacidade</Title>
      <p>
        Os seguintes termos e condições regem o uso do site instarank.com.br. Ao
        acessar ou usar o site, você concorda em ficar vinculado aos seguintes
        termos e condições. Se você não concordar com todos esses termos e
        condições, você não deve acessar ou usar o site.
      </p>
      <ul>
        <li>
          <b>Uso do site:</b> O site é destinado a uso pessoal e não comercial.
          Você concorda em usar o site somente para fins legais e de acordo com
          as políticas e procedimentos estabelecidos pelo site.
        </li>
        <li>
          <b>Conteúdo do site:</b> O conteúdo do site, incluindo texto,
          gráficos, imagens e outros materiais, é propriedade da instarank ou de
          seus licenciadores e está protegido por leis de propriedade
          intelectual. Exceto conforme expressamente permitido por esses termos
          e condições ou por outros termos e condições estabelecidos pelo site,
          você não poderá reproduzir, distribuir, exibir, vender, comercializar,
          modificar ou de outra forma explora qualquer conteúdo do site.
        </li>
        <li>
          <b>Responsabilidade:</b> O site fornece informações e conteúdo com
          base na informação disponível. O site não garante a precisão,
          integridade ou atualidade do conteúdo e não se responsabiliza por
          erros ou omissões no conteúdo. O site também não se responsabiliza por
          quaisquer danos ou prejuízos decorrentes do uso ou da incapacidade de
          usar o site.
        </li>
        <li>
          <b>Política de Privacidade:</b> O site respeita a privacidade dos
          usuários e coleta, armazena e usa informações pessoais de acordo com
          sua política de privacidade.
        </li>
        <li>
          <b>Alterações:</b> O site pode alterar esses termos e condições a
          qualquer momento. Ao continuar a usar o site após tais alterações,
          você concorda em ficar vinculado aos novos termos e condições.
        </li>
        <li>
          <b>Disponibilidade:</b> O site não garante a disponibilidade contínua
          do site e pode interromper ou suspender o site a qualquer momento sem
          aviso prévio.
        </li>
        <li>
          <b>Isenção de responsabilidade:</b> A instarank não se responsabiliza
          por qualquer conteúdo exibido em seus sites e aplicativos.
        </li>
        <li>
          <b>Conteúdo de terceiros:</b> O site pode incluir links para sites de
          terceiros ou conteúdo de terceiros, incluindo anúncios. A instarank
          não se responsabiliza pelo conteúdo ou políticas de privacidade desses
          sites de terceiros.
        </li>
        <li>
          <b>Uso ilegal:</b> Você concorda em não usar o site para fins ilegais
          ou proibidos por esses termos e condições, incluindo, sem limitação, a
          coleta de informações pessoais de outros usuários do site.
        </li>
        <li>
          <b>Indenização:</b> Você concorda em indenizar, defender e isentar a
          instarank de quaisquer reivindicações, danos, custos e despesas,
          incluindo honorários advocatícios, decorrentes do seu uso do site ou
          violação desses termos e condições.
        </li>
        <li>
          <b>Lei aplicável:</b> Esses termos e condições serão regidos e
          interpretados de acordo com as leis do Brasil, sem dar efeito às
          escolhas de lei ou conflitos de lei regras.
        </li>
        <li>
          <b>Resolução de Disputas:</b> Qualquer disputa decorrente ou
          relacionada a esses termos e condições será resolvida exclusivamente
          através de arbitragem vinculante, de acordo com as regras da Câmara de
          Comércio Internacional.
        </li>
        <li>
          <b>Acesso não autorizado:</b> Você concorda em não acessar ou tentar
          acessar áreas restritas do site ou contas de outros usuários sem
          autorização.
        </li>
        <li>
          <b>Modificações do site:</b> A instarank se reserva o direito de
          modificar, interromper ou descontinuar qualquer aspecto do site a
          qualquer momento sem aviso prévio.
        </li>
        <li>
          <b>Conteúdo de usuário:</b> Ao enviar conteúdo para o site, você
          garante que possui todos os direitos necessários para compartilhar
          esse conteúdo e que ele não viola nenhuma lei ou direito de terceiros.
          A instarank se reserva o direito de remover qualquer conteúdo de
          usuário que violar essas regras.
        </li>
        <li>
          <b>Comentários e feedback:</b> A instarank aprecia comentários e
          feedback dos usuários sobre o site, mas não se compromete a responder
          ou considerar esses comentários e feedback. A instarank se reserva o
          direito de usar qualquer comentário ou feedback para fins comerciais
          sem restrições e sem reconhecimento ou compensação para o usuário.
        </li>
        <li>
          <b>Cessão:</b> Você não pode ceder esses termos e condições sem o
          consentimento prévio por escrito da instarank.
        </li>
        <li>
          <b>Queda de seguidores:</b> A instarank não se responsabiliza por
          queda de seguidores ou possivelmente banimento da conta.
        </li>
        <li>
          <b>Integridade dos termos:</b> Se qualquer cláusula desses termos e
          condições for considerada inválida ou inexequível, essa cláusula será
          removida e as demais cláusulas permanecerão válidas e exequíveis.
        </li>
        <li>
          <b>Notificações:</b> A instarank pode fornecer notificações a você por
          meio de e-mail ou publicação no site.
        </li>
        <li>
          <b>Aceitação dos termos:</b> Ao usar o site, você confirma que leu,
          compreendeu e concordou com esses termos e condições.
        </li>
        <li>
          <b>Contato:</b> Autorizo a instarank a entrar em contato comigo por
          qualquer meio de contato, isso inclui porem não se limita a: e-mail,
          telefone, SMS, WhatsApp, Direct no Instagram das contas que informo ao
          fazer meu pedido.
        </li>
      </ul>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  padding: 0 20px;

  li {
    margin-bottom: 20px;
  }
`;

const Title = styled.h1`
  ${({ theme }) => css`
    font-size: ${theme.text.title.fontSize};
    line-height: ${theme.text.title.lineHeight};
    color: ${theme.text.title.color};
    font-weight: ${theme.text.title.fontWeight};
    text-align: center;
  `};
`;
