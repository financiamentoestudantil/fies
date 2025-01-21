# Requerimento de Reembolso - Fundo de Financiamento Estudantil (FIES)

## Descrição do Projeto

Este projeto tem como objetivo fornecer uma interface interativa para preenchimento de um requerimento de reembolso para o Fundo de Financiamento Estudantil (FIES). O sistema é composto por um formulário de qualificação, uma seção para justificativa e uma tabela de demonstrativo financeiro. Além disso, a aplicação permite calcular o valor total a ser reembolsado e exportar o requerimento em formato PDF.

---

## Estrutura do Projeto

### 1. **Arquivos**

- **`index.html`**: Arquivo principal contendo a estrutura HTML da aplicação.
- **`src/style.css`**: Arquivo CSS para estilização da interface.
- **`src/script.js`**: Arquivo JavaScript contendo toda a lógica de funcionalidade.

### 2. **Seções da Interface**

#### 2.1. Formulário de Qualificação
- **Campos**:
  - Nome do estudante
  - CPF
  - UF
  - Município
  - Curso
  - Telefone
  - E-mail

#### 2.2. Justificativa do Pedido
- Texto explicativo sobre o motivo do requerimento baseado na Portaria Normativa MEC nº 209.

#### 2.3. Demonstrativo Financeiro
- **Tabela com colunas**:
  - Mês/Ano
  - Valor da mensalidade
  - Valor pago pelo FIES
  - Valor pago pelo estudante
  - Outros Débitos
  - Outros Créditos

- **Funcionalidades**:
  - Seleção de semestre com preenchimento dinâmico dos meses na tabela.
  - Cálculo do valor total a ser reembolsado.
  - Exportação do demonstrativo em formato PDF.

---

## Funcionalidades

### 1. Preenchimento Automático
- Os campos de `UF` e `Semestre` são preenchidos automaticamente ao carregar a página.
- Os últimos 12 meses são calculados dinamicamente para serem exibidos nos selects da tabela.

### 2. Máscaras de Formatação
- CPF: Formatação no estilo `xxx.xxx.xxx-xx`.
- Telefone: Formatação no estilo `(xx) xxxxx-xxxx`.

### 3. Validação de Campos
- Validação de e-mail com exibição de mensagens de erro em caso de formato inválido.
- Validação de valores monetários inseridos nos campos da tabela.

### 4. Exportação de PDF
- Utilização da biblioteca `jsPDF` e `jspdf-autotable` para gerar um arquivo PDF contendo os dados do formulário e da tabela de demonstrativo financeiro.

### 5. Design Responsivo
- Layout ajustado para diferentes tamanhos de tela, utilizando media queries no CSS.

---

## Pré-requisitos

### Bibliotecas Utilizadas
- **`jsPDF`**: Geração de arquivos PDF.
- **`jspdf-autotable`**: Criação de tabelas dentro do PDF gerado.

---

## Guia de Instalação

1. Clone este repositório:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   ```

2. Acesse o diretório do projeto:
   ```bash
   cd <NOME_DO_DIRETORIO>
   ```

3. Abra o arquivo `index.html` no navegador para visualizar o sistema.

---

## Estrutura do Código

### **`index.html`**

Responsável pela estruturação da interface. Principais elementos:

- **Formulário de Qualificação**
  ```html
  <form id="reembolsoForm">
      <div class="form-group">
          <label for="nome">Nome do estudante:</label>
          <input type="text" id="nome" autocomplete="name" required>
      </div>
      <!-- Outros campos similares -->
  </form>
  ```

- **Tabela de Demonstrativo Financeiro**
  ```html
  <table>
      <thead>
          <tr>
              <th>Mês/Ano</th>
              <th>Valor da mensalidade</th>
              <th>Valor pago pelo FIES</th>
              <th>Valor pago pelo estudante</th>
              <th>Outros Débitos</th>
              <th>Outros Créditos</th>
          </tr>
      </thead>
      <tbody>
          <!-- Linhas adicionadas dinamicamente -->
      </tbody>
  </table>
  ```

### **`src/style.css`**

Responsável pela estilização. Principais elementos:

- **Variáveis de cores**
  ```css
  :root {
      --byzantine-blue: #4256C8;
      --white: #FFFFFF;
      --green: #63C132;
      --blue-06: #DBE8FB;
  }
  ```

- **Botões**
  ```css
  button {
      font-family: 'Poppins', sans-serif;
      background-color: var(--byzantine-blue);
      color: var(--white);
      border: none;
      border-radius: 8px;
      padding: 18px 28px;
      cursor: pointer;
      transition: all 0.3s ease-in-out;
  }

  button:hover {
      background-color: var(--white);
      color: var(--blue-03);
  }
  ```

### **`src/script.js`**

Contém toda a lógica funcional. Principais funções:

1. **Preenchimento dos Meses na Tabela**
   ```javascript
   function preencherMesesAno() {
       const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
       // Código para calcular e preencher os meses...
   }
   ```

2. **Cálculo do Reembolso**
   ```javascript
   function calcularReembolso() {
       let totalReembolso = 0;
       const linhas = document.querySelectorAll("table tbody tr");
       linhas.forEach((linha) => {
           // Código para calcular valores monetários...
       });
   }
   ```

3. **Cálculo Automático de Reembolso**
   ```javascript
   document.querySelectorAll(".monetary-input").forEach((input) => {
       input.addEventListener("blur", calcularReembolso);
    // O cálculo do reembolso é feito automaticamente ao sair de um campo ou mudar para outro campo, utilizando o evento blur. Isso elimina a necessidade de clicar em um botão para executar o cálculo.
   });
   ```

4. **Exportação para PDF**
   ```javascript
   function exportarRequerimento() {
       const { jsPDF } = window.jspdf;
       const doc = new jsPDF();
       // Código para gerar o PDF...
   }
   ```

---

## Como Usar

1. Preencha os dados do formulário de qualificação.
2. Escolha o semestre desejado para atualizar os meses na tabela.
3. Insira os valores financeiros em cada linha da tabela.
4. Clique em "Calcular Reembolso" para visualizar o valor total.
5. Clique em "Exportar Requerimento" para baixar o PDF gerado.
