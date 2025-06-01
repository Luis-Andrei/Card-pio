# Cardápio Digital Interativo

Este projeto é um exemplo de cardápio digital interativo com funcionalidades de carrinho de compras e um painel administrativo simples para gerenciamento de itens.

## Funcionalidades Principais

*   **Cardápio Dinâmico:** Os itens do cardápio são carregados e exibidos dinamicamente, agrupados por categoria.
*   **Carrinho de Compras:** Adicione itens ao carrinho, visualize o total e finalize o pedido via WhatsApp.
*   **Sistema de Avaliações:** Avalie os pratos (funcionalidade básica, pode ser expandida).
*   **Modo Administrativo:** Gerencie os itens do cardápio, exporte/importe dados e visualize estatísticas simples (quando habilitado).

## Como Usar

1.  Abra o arquivo `index.html` em um navegador web moderno.
2.  Ao carregar a página, um diálogo de boas-vindas solicitará seu nome.
3.  Explore o cardápio e adicione itens ao carrinho clicando nos botões correspondentes.
4.  Clique no ícone do carrinho para visualizar os itens selecionados e finalizar o pedido.

## Acesso ao Modo Administrativo

O modo administrativo permite gerenciar os itens do cardápio. Ele é controlado por uma flag no código e protegido por senha.

Para acessar:

1.  Ao abrir a página, no diálogo de boas-vindas que pede seu nome, digite exatamente: `3 Aliança`
2.  Um novo diálogo solicitará a senha de administrador.
3.  A senha padrão é: `123456`
4.  Após inserir a senha correta, o painel administrativo será exibido, permitindo adicionar, editar, excluir e gerenciar itens do cardápio, além de exportar/importar o menu.

## Desativando o Modo Administrativo

Se você não precisar do painel administrativo, pode desativá-lo alterando uma linha no código:

1.  Abra o arquivo `src/main.js`.
2.  Encontre a linha que define a constante `ENABLE_ADMIN`:
    ```javascript
    const ENABLE_ADMIN = true; // Mude para false para desativar o admin
    ```
3.  Mude `true` para `false`.
4.  Salve o arquivo.

Com `ENABLE_ADMIN` definido como `false`, a opção de login admin não estará disponível no diálogo de boas-vindas, e o código relacionado ao admin será em grande parte ignorado.

## Estrutura do Projeto

*   `index.html`: Estrutura principal da página web.
*   `src/`: Contém os arquivos JavaScript e CSS.
    *   `src/main.js`: Ponto de entrada principal, inicialização do carrinho e admin, lógica de carregamento do menu e funcionalidades gerais.
    *   `src/cart.js`: Lógica e funcionalidades relacionadas ao carrinho de compras.
    *   `src/admin.js`: Lógica e funcionalidades do painel administrativo.
    *   `src/avaliacoes.js`: Lógica e funcionalidades do sistema de avaliações.
    *   `src/styles.css`: Estilos CSS gerais para o cardápio e layout.
    *   `src/cart.css`: Estilos CSS específicos para o carrinho.
    *   `src/admin-panel.css`: Estilos CSS específicos para o painel administrativo.

## 🚀 Funcionalidades

- **Cardápio Digital**: Exibição de produtos com imagens, descrições e preços
- **Sistema de Avaliações**: 
  - Avaliação por estrelas (1-5)
  - Comentários opcionais
  - Exibição das últimas avaliações positivas (4-5 estrelas)
  - Média geral de avaliações
- **Carrinho de Compras**:
  - Adição/remoção de itens
  - Cálculo de total
  - Opções de entrega e retirada em loja
  - Cálculo de taxa de entrega por bairro
- **Design Responsivo**: Adaptado para diferentes tamanhos de tela
- **Sistema de Login**: Autenticação de usuários
- **Histórico de Pedidos**: Visualização de pedidos anteriores
- **Sistema de Cupons**: Aplicação de cupons de desconto

## 🛠️ Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (Vanilla)
- LocalStorage para persistência de dados
- Git para controle de versão
- GitHub para hospedagem do código
- Vercel para deploy

## 📦 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Luis-Andrei/Card-pio.git
```

2. Navegue até o diretório do projeto:
```bash
cd Card-pio
```

3. Abra o arquivo `index.html` em seu navegador ou use um servidor local.

## 🌐 Deploy

O projeto está hospedado na Vercel e pode ser acessado em: [Link do Deploy]

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Para contribuir:

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/AmazingFeature`)
3. Faça o Commit das suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Faça o Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ✨ Funcionalidades Implementadas

- [x] Sistema de Nomes para clientes
- [] Histórico de pedidos
- [x] Integração com WhatsApp para pedidos
- [x] Área administrativa para gestão do cardápio
- [] Sistema de cupons de desconto 