// Função para preencher os campos de Mês/Ano com os últimos 12 meses
function preencherMesesAno() {
    const meses = [
        "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", 
        "Jul", "Ago", "Set", "Out", "Nov", "Dez"
    ];

    // Pega o mês e o ano atuais
    const dataAtual = new Date();
    const mesAtual = dataAtual.getMonth(); // Mês atual (0 a 11)
    const anoAtual = dataAtual.getFullYear(); // Ano atual

    let mesesAno = [];

    // Preencher os últimos 12 meses (começando pelo mês atual)
    for (let i = 0; i < 12; i++) {
        // Calcula o índice do mês, ajustando para meses passados
        const mesIndex = (mesAtual - i + 12) % 12;
        
        // Calcula o ano corretamente para meses passados
        const ano = mesAtual - i < 0 ? anoAtual - 1 : anoAtual;
        
        mesesAno.push(`${meses[mesIndex]}/${ano}`);
    }

    // Preencher os selects
    const selects = document.querySelectorAll('.mesAno');
    selects.forEach((select) => {
        // Limpar as opções existentes
        select.innerHTML = "";

        // Adicionar a opção padrão
        let option = document.createElement("option");
        option.value = "";
        option.text = "Selecione";
        select.appendChild(option);

        // Adicionar as opções de meses e anos
        mesesAno.forEach(mesAno => {
            let option = document.createElement("option");
            option.value = mesAno;
            option.text = mesAno;
            select.appendChild(option);
        });
    });
}

// Chama a função de preenchimento dos meses quando a página carrega
window.onload = function() {
    preencherMesesAno();
};


function calcularReembolso() {
    let totalReembolso = 0;

    // Seleciona todas as linhas da tabela de dados
    const linhas = document.querySelectorAll("table tbody tr");

    // Para cada linha, pega os valores inseridos
    linhas.forEach(function (linha) {
        // Função para limpar e converter o valor monetário para número
        function limparValor(valor) {
            if (!valor) return 0; // Retorna 0 se o campo estiver vazio
            return parseFloat(
                valor.replace("R$", "").replace(".", "").replace(",", ".").trim()
            ) || 0;
        }

        const mensalidade = limparValor(
            linha.querySelector('td:nth-child(2) input').value
        );
        const fies = limparValor(
            linha.querySelector('td:nth-child(3) input').value
        );
        const estudante = limparValor(
            linha.querySelector('td:nth-child(4) input').value
        );
        const seguroTaxa = limparValor(
            linha.querySelector('td:nth-child(5) input').value
        );
        const outrosDebitos = limparValor(
            linha.querySelector('td:nth-child(6) input').value
        );
        const outrosCreditos = limparValor(
            linha.querySelector('td:nth-child(7) input').value
        );

        // Calcula o valor a ser reembolsado e soma
        totalReembolso += fies + estudante - mensalidade - outrosDebitos - seguroTaxa + outrosCreditos;

        // Aplica a cor de texto nas células com base no tipo (débito ou crédito)
        aplicarCorTabela(linha, mensalidade, seguroTaxa, outrosDebitos, fies, estudante, outrosCreditos);
    });

    // Atualiza o valor total na página
    const totalReembolsoElement = document.getElementById("totalReembolso");
    totalReembolsoElement.innerText = `R$ ${totalReembolso
        .toFixed(2)
        .replace(".", ",")}`;

    // Atualiza a classe do cartão com base no valor
    const totalContainer = document.getElementById("totalContainer");
    if (totalReembolso < 0) {
        totalContainer.classList.remove("positive");
        totalContainer.classList.add("negative");
    } else {
        totalContainer.classList.remove("negative");
        totalContainer.classList.add("positive");
    }

    // Adiciona animação de destaque no valor
    totalReembolsoElement.classList.add("animate");
    setTimeout(() => {
        totalReembolsoElement.classList.remove("animate");
    }, 500); // Remove a classe após 500ms (duração da animação)
}

// Adiciona o evento de blur (ou change) aos inputs monetários
document.querySelectorAll(".monetary-input").forEach((input) => {
    input.addEventListener("blur", calcularReembolso); // Executa o cálculo ao sair do campo
});

function exportarRequerimento() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Estilo e cores
    const corTituloPrincipal = "#070914"; // Cor para os títulos principais
    const corTextoSecundario = "#141A3C"; // Cor para o texto secundário
    const corTextoCelas = "#141A3C"; // Cor para o texto das células da tabela
    const corDebito = "#EE6A43"; // Cor para débitos
    const corCredito = "#0880cf"; // Cor para créditos
    const corLinhaPar = [240, 248, 255]; // Azul claro para linhas pares
    const corLinhaImpar = [255, 255, 255]; // Branco para linhas ímpares
    
    // Adicionar o título do documento sobre a barra
    doc.setFont("helvetica", "bold");
    doc.setTextColor(corTituloPrincipal); // Cor para o título
    doc.setFontSize(16);
    doc.text("Requerimento de Reembolso", 20, 8); // Título

    // Adicionar subtítulo abaixo da barra
    doc.setFontSize(10);
    doc.setTextColor(corTituloPrincipal); // Cor do subtítulo
    doc.text("Fundo de Financiamento Estudantil - Fies", 20, 13); // Subtítulo

    // Inicializar a posição para o início da Seção 1
    let startY = 22; // Início da Seção 1

    // Seção 1 - Qualificação
    doc.setFont("helvetica", "bold");
    doc.setTextColor(corTituloPrincipal);
    doc.setFontSize(12);
    doc.text("1 - Dados do(a) Estudante", 20, startY);

    // Dados do formulário
    const nome = document.getElementById("nome").value || "Não informado";
    const cpf = document.getElementById("cpf").value || "Não informado";
    const numero_matricula = document.getElementById("numero-matricula").value || "Não informado";
    const curso = document.getElementById("curso").value || "Não informado";
    const telefone = document.getElementById("telefone").value || "Não informado";
    const email = document.getElementById("email").value || "Não informado";

    startY += 7; // Ajustar a posição Y após o título da seção
    const fields = [
        { label: "Nome", value: nome },
        { label: "CPF", value: cpf },
        { label: "Nº Matrícula (RA)", value: numero_matricula },
        { label: "Curso", value: curso },
        { label: "Telefone", value: telefone },
        { label: "E-mail", value: email },
    ];

    fields.forEach((field, index) => {
        // Título em Bold com cor secundária
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(corTextoSecundario);
        doc.text(`${field.label}:`, 20, startY + index * 5); // Espaçamento menor entre os campos

        // Valor em Normal
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(`${field.value}`, 70, startY + index * 5); // Espaçamento menor entre os campos
    });

    startY += fields.length * 5 + 5; // Ajusta a posição Y para a próxima seção com um espaçamento menor

    // Seção 2 - Dados da Instituição de Ensino
    doc.setFont("helvetica", "bold");
    doc.setTextColor(corTituloPrincipal);
    doc.setFontSize(12);
    doc.text("2 - Dados da Instituição de Ensino", 20, startY);

    // Dados do formulário
    const instituicao = document.getElementById("instituicao").value || "Não informado";
    const localOferta = document.getElementById("localOferta").value || "Não informado";

    startY += 7; // Ajusta a posição Y após o título da seção
    const fields_instituicao = [
        { label: "Instituição de Ensino", value: instituicao },
        { label: "Local da oferta (Campus)", value: localOferta },
    ];

    fields_instituicao.forEach((field, index) => {
        // Título em Bold com cor secundária
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(corTextoSecundario);
        doc.text(`${field.label}:`, 20, startY + index * 5); // Espaçamento menor entre os campos

        // Valor em Normal
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(`${field.value}`, 70, startY + index * 5); // Espaçamento menor entre os campos
    });

    startY += fields_instituicao.length * 5 + 5; // Ajusta a posição Y para a próxima seção com um espaçamento menor

    // Seção 3 - Justificativa do pedido
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(corTituloPrincipal);
    doc.text("3 - Justificativa do pedido", 20, startY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(corTextoSecundario);

    const texto1 = "Com base no artigo 58, §6º, da Portaria Normativa MEC nº 209, de 7 de março de 2018, solicita-se o ressarcimento dos valores recebidos pela Instituição de Ensino, correspondentes aos repasses do Fies relativos às parcelas da semestralidade já quitadas pelo(a) estudante.";
    const texto2 = "Requer-se que a devolução seja efetuada em moeda corrente no prazo legal máximo de 15 (quinze) dias, contados a partir da notificação formal deste pedido.";
    const texto3 = "Os documentos anexos comprovam o pagamento das mensalidades realizado pelo(a) estudante, a contratação do Fies e os repasses efetuados à instituição de ensino.";

    // Adicionar o texto no PDF com quebras de linha
    doc.text(texto1, 20, startY + 6, { maxWidth: 170 });
    startY += 15; // Aumenta o espaço após o primeiro parágrafo

    doc.text(texto2, 20, startY + 6, { maxWidth: 170 });
    startY += 12; // Espaço para o próximo parágrafo

    doc.text(texto3, 20, startY + 6, { maxWidth: 170 });
    startY += 10; // Espaço para o próximo parágrafo

    // Seção 4 - Demonstrativo financeiro
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(corTituloPrincipal);
    startY += 10; // Ajusta a posição Y antes do título para não sobrepor
    doc.text("4 - Demonstrativo financeiro", 20, startY);

    startY += 6; // Ajustar Y após o título

    // Adicionar tabela de valores
    doc.autoTable({
        head: [
            [
                'Mês/Ano',
                'Valor da mensalidade',
                'Valor pago pelo Fies',
                'Valor pago pelo estudante',
                'Seguro prestamista + taxa administrativa (Caixa)',
                'Outros débitos',
                'Outros créditos',
            ],
        ],
        body: Array.from(document.querySelectorAll("table tbody tr")).map((linha, index) => {
            const mensalidade = linha.querySelector('td:nth-child(2) input').value || '0,00';
            const fies = linha.querySelector('td:nth-child(3) input').value || '0,00';
            const estudante = linha.querySelector('td:nth-child(4) input').value || '0,00';
            const seguroTaxa = linha.querySelector('td:nth-child(5) input').value || '0,00';
            const outrosDebitos = linha.querySelector('td:nth-child(6) input').value || '0,00';
            const outrosCreditos = linha.querySelector('td:nth-child(7) input').value || '0,00';

            // Definindo a cor de fundo das linhas (alternando entre azul claro e branco)
            const fillColor = index % 2 === 0 ? corLinhaPar : corLinhaImpar;

            return [
                { content: linha.querySelector('td:nth-child(1) select').value || "-", styles: { fillColor } },
                { content: mensalidade, styles: { textColor: corDebito, fillColor } },
                { content: fies, styles: { textColor: corCredito, fillColor } },
                { content: estudante, styles: { textColor: corCredito, fillColor } },
                { content: seguroTaxa, styles: { textColor: corDebito, fillColor } },
                { content: outrosDebitos, styles: { textColor: corDebito, fillColor } },
                { content: outrosCreditos, styles: { textColor: corCredito, fillColor } },
            ];
        }),
        startY: startY,
        theme: 'grid',
        headStyles: { 
            fillColor: "#4256C8", 
            textColor: "#FFFFFF", 
            halign: "center", 
            valign: "middle", 
        },
        styles: { 
            fontSize: 9, 
            cellPadding: 3, 
            textColor: corTextoCelas, // Cor das células
            halign: "center", 
            valign: "middle", 
        },
        columnStyles: {
            0: { cellWidth: 20 },
            1: { cellWidth: 27 },
            2: { cellWidth: 27 },
            3: { cellWidth: 27 },
            4: { cellWidth: 28 },
            5: { cellWidth: 27 },
            6: { cellWidth: 27 },
        },
    });

    // Título "Valor Total a Ser Reembolsado" em Bold com cor principal
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(corTituloPrincipal); // Cor para o título principal
    const totalReembolso = document.getElementById("totalReembolso").textContent || "R$ 0,00";
    doc.text(`Valor total a ser reembolsado: ${totalReembolso}`, 20, doc.lastAutoTable.finalY + 10);

    // Detalhes adicionais com cor secundária
    const outrosDetalhes = document.getElementById("outros-detalhes").value || "Nenhum detalhe adicional informado.";
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(corTextoSecundario); // Cor secundária
    doc.text("Detalhes adicionais:", 20, doc.lastAutoTable.finalY + 18);
    doc.setFontSize(8);
    doc.text(outrosDetalhes, 20, doc.lastAutoTable.finalY + 23, { maxWidth: 170 });
    
    // Chave Pix com cor secundária
    const chavepix = document.getElementById("chave-pix").value || "Nenhuma chave informada.";
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(corTextoSecundario); // Cor secundária
    doc.text("Autorizo que o ressarcimento seja realizado por meio da chave Pix:", 20, doc.lastAutoTable.finalY + 43);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(chavepix, 135, doc.lastAutoTable.finalY + 43, { maxWidth: 170 });
    
    // Adicionar campo de Data
    const dataAtual = new Date();
    const diasDaSemana = [
        "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", 
        "Quinta-feira", "Sexta-feira", "Sábado"
    ];
    const meses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    // Obter a data no formato por extenso: "19 de Janeiro de 2025"
    const dia = dataAtual.getDate();
    const mes = meses[dataAtual.getMonth()];
    const ano = dataAtual.getFullYear();

    // Montar a data por extenso
    const dataFormatada = `${dia} de ${mes} de ${ano}`;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(corTextoSecundario); // Cor secundária

    // Adicionar campo de Assinatura do Estudante
    doc.text("Declaro, sob as penas da lei, serem verdadeiras as informações acima.", 20, doc.lastAutoTable.finalY + 50);
    doc.text("Data:", 20, doc.lastAutoTable.finalY + 55);
    doc.text(dataFormatada, 30, doc.lastAutoTable.finalY + 55);
    doc.text("_______________________________________________________________", 20, doc.lastAutoTable.finalY + 62);
    doc.text("Assinatura do(a) Estudante", 20, doc.lastAutoTable.finalY + 67);
   

    // Criar o nome do arquivo com o nome do usuário
    const nomeArquivo = `Requerimento de Reembolso - ${nome}.pdf`;
    
    // Salvar o PDF
    doc.save(nomeArquivo)
}

    
// Função para aplicar a máscara no CPF
function mascaraCPF(input) {
    // Remove todos os caracteres não numéricos
    let valor = input.value.replace(/\D/g, "");

    // Aplica a máscara: xxx.xxx.xxx-xx
    if (valor.length <= 11) {
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d{2})$/, "$1-$2");
    }

    // Atualiza o valor do campo com a máscara
    input.value = valor;
}

// Aplica a máscara ao campo CPF assim que o valor for alterado
document.getElementById('cpf').addEventListener('input', function () {
    mascaraCPF(this);
});



// Função para carregar as opções de UF no campo suspenso
function carregarUF() {
    const ufs = [
        "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", 
        "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", 
        "RS", "RO", "RR", "SC", "SP", "SE", "TO"
    ];
    
    // Seleciona o campo de UF no HTML
    const selectUF = document.getElementById('uf');

    // Limpar opções existentes
    selectUF.innerHTML = "";

    // Adicionar um placeholder inicial
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Selecione";
    placeholder.disabled = true;
    placeholder.selected = true;
    placeholder.hidden = true; // Esconde a opção no menu suspenso
    selectUF.appendChild(placeholder);

    // Preenche o campo com as opções de UF
    ufs.forEach((uf) => {
        const option = document.createElement('option');
        option.textContent = uf;
        option.value = uf;
        selectUF.appendChild(option);
    });
}

// Carrega as opções de UF ao carregar a página
window.onload = function() {
    carregarUF();
};


// Função para aplicar a máscara no telefone
function mascaraTelefone(input) {
    // Remove tudo que não for número
    let valor = input.value.replace(/\D/g, "");

    // Aplica a máscara: (xx) xxxxx-xxxx
    if (valor.length <= 11) {
        valor = valor.replace(/^(\d{2})(\d)/, "($1) $2"); // Adiciona os parênteses e o espaço
        valor = valor.replace(/(\d{5})(\d{1})$/, "$1-$2"); // Adiciona o hífen após os 5 primeiros números
    }

    // Atualiza o valor do campo com a máscara
    input.value = valor;
}

// Função que será chamada ao digitar no campo telefone
const handlePhone = (event) => {
    let input = event.target;
    input.value = phoneMask(input.value); // Aplica a máscara no valor digitado
  }
  
  // Função para formatar o número de telefone
  const phoneMask = (value) => {
    if (!value) return ""; // Se o campo estiver vazio, retorna vazio
    value = value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    value = value.replace(/(\d{2})(\d)/, "($1) $2"); // Adiciona o parêntese e espaço após os dois primeiros números
    value = value.replace(/(\d)(\d{4})$/, "$1-$2"); // Coloca o hífen após o 5º número
    return value; // Retorna o valor formatado
  }
  
  // Aplica a máscara ao campo de telefone assim que o valor for alterado
  document.getElementById('telefone').addEventListener('input', handlePhone);

  
// Função para validar o e-mail
function validacaoEmail(field) {
    let usuario = field.value.substring(0, field.value.indexOf("@"));
    let dominio = field.value.substring(field.value.indexOf("@") + 1, field.value.length);

    // Verificação das condições para um e-mail válido
    if (
        (usuario.length >= 1) &&
        (dominio.length >= 3) &&
        (usuario.search("@") == -1) &&
        (dominio.search("@") == -1) &&
        (usuario.search(" ") == -1) &&
        (dominio.search(" ") == -1) &&
        (dominio.search(".") != -1) &&
        (dominio.indexOf(".") >= 1) &&
        (dominio.lastIndexOf(".") < dominio.length - 1)
    ) {
        document.getElementById("msgemail").innerHTML = "";  // Limpa a mensagem caso o e-mail seja válido
    } else {
        document.getElementById("msgemail").innerHTML = "<font color='red'>E-mail inválido</font>";  // Exibe mensagem de erro
        document.getElementById("msgemail").style.color = "red";  // Mensagem de erro
    }
}

// Aplica a validação ao campo de e-mail enquanto o usuário digita
document.getElementById('email').addEventListener('input', function() {
    validacaoEmail(this);
});


document.addEventListener('DOMContentLoaded', () => {
    const monetaryInputs = document.querySelectorAll('.monetary-input');

    monetaryInputs.forEach(input => {
        input.addEventListener('input', validateAndFormatCurrency);
        input.addEventListener('blur', addCurrencySymbol);
    });

    function validateAndFormatCurrency(event) {
        let input = event.target;
        let value = input.value.replace(/\D/g, ''); // Remove tudo que não for número

        // Se o valor estiver vazio após a remoção de caracteres inválidos
        if (value === '') {
            input.value = ''; // Limpa o campo
            showValidationMessage(input, "Por favor, insira apenas números.");
            return;
        }

        // Divide por 100 para simular casas decimais
        value = (parseInt(value) / 100).toFixed(2).toString();

        // Formata o número com separadores de milhares e vírgula como decimal
        value = value.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        input.value = `R$ ${value}`;
    }

    function addCurrencySymbol(event) {
        let input = event.target;
        if (input.value !== '' && !input.value.startsWith('R$')) {
            input.value = `R$ ${input.value}`;
        }
    }

    function showValidationMessage(input, message) {
        // Procura por mensagens existentes
        removeExistingValidationMessage(input);

        // Cria o elemento de mensagem de validação
        let validationMessage = document.createElement('span');
        validationMessage.className = 'validation-message';
        validationMessage.textContent = message;

        // Insere a mensagem logo após o input
        input.parentNode.appendChild(validationMessage);

        // Remove a mensagem após 3 segundos
        setTimeout(() => {
            removeExistingValidationMessage(input);
        }, 2500);
    }

    function removeExistingValidationMessage(input) {
        const existingMessage = input.parentNode.querySelector('.validation-message');
        if (existingMessage) {
            existingMessage.remove();
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    preencherSemestres();
});


function preencherSemestres() {
    const selectSemestre = document.getElementById("semestre");

    // Data atual
    const dataAtual = new Date();
    const anoAtual = dataAtual.getFullYear();
    const mesAtual = dataAtual.getMonth() + 1; // Janeiro é 0, adicionamos 1

    // Determinar os semestres
    let semestres = [];

    // Adiciona o semestre atual
    if (mesAtual <= 6) {
        // Estamos no 1º semestre
        semestres.push(`01/${anoAtual}`);
    } else {
        // Estamos no 2º semestre
        semestres.push(`02/${anoAtual}`);
    }

    // Adiciona os dois semestres anteriores
    semestres.push(`02/${anoAtual - 1}`, `01/${anoAtual - 1}`);

    // Ordenar em ordem decrescente
    semestres.sort((a, b) => {
        const [semestreA, anoA] = a.split("/");
        const [semestreB, anoB] = b.split("/");
        return parseInt(anoB) - parseInt(anoA) || parseInt(semestreB) - parseInt(semestreA);
    });

    // Limpar opções existentes
    selectSemestre.innerHTML = "";

    // Adicionar um placeholder inicial
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Selecione";
    placeholder.disabled = true;
    placeholder.selected = true;
    placeholder.hidden = true; // Esconde a opção no menu suspenso
    selectSemestre.appendChild(placeholder);

    // Adicionar os semestres calculados
    semestres.forEach((semestre) => {
        const option = document.createElement("option");
        option.value = semestre;
        option.textContent = semestre;
        selectSemestre.appendChild(option);
    });
}

function atualizarMesesTabela() {
    const selectSemestre = document.getElementById("semestre");
    const semestreSelecionado = selectSemestre.value;
    const tabelaLinhas = document.querySelectorAll("table tbody tr");

    if (!semestreSelecionado) return;

    // Determinar os meses do semestre selecionado
    const [semestre, ano] = semestreSelecionado.split("/");
    let mesesCorrespondentes = [];

    if (semestre === "01") {
        mesesCorrespondentes = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"].map(
            (mes) => `${mes}/${ano}`
        );
    } else if (semestre === "02") {
        mesesCorrespondentes = ["Jul", "Ago", "Set", "Out", "Nov", "Dez"].map(
            (mes) => `${mes}/${ano}`
        );
    }

    // Atualizar as linhas da tabela dinamicamente
    tabelaLinhas.forEach((linha, index) => {
        const selectMesAno = linha.querySelector("select.mesAno");

        // Limpa o select antes de preencher
        selectMesAno.innerHTML = "";

        // Adicionar as opções dos meses correspondentes
        if (index < mesesCorrespondentes.length) {
            const option = document.createElement("option");
            option.value = mesesCorrespondentes[index];
            option.textContent = mesesCorrespondentes[index];
            selectMesAno.appendChild(option);
        }

        // Habilita temporariamente para aplicar alterações e bloqueia novamente
        selectMesAno.disabled = false;
        setTimeout(() => {
            selectMesAno.disabled = true;
        }, 100); // Bloqueia novamente após 100ms
    });
}

function aplicarCorTabela(linha, mensalidade, seguroTaxa, outrosDebitos, fies, estudante, outrosCreditos) {
    // Função para aplicar a cor de texto de acordo com o tipo de valor (débito ou crédito)
    function aplicarCor(campo, valor, tipo) {
        // Débito (vermelho)
        if (tipo === 'debito') {
            campo.style.color = "#EE6A43";  // Vermelho para débitos
        }
        // Crédito (azul)
        else if (tipo === 'credito') {
            campo.style.color = "#0880cf";  // Azul para créditos
        }
    }

    // Aplica as cores nas células da tabela (apenas no texto)
    aplicarCor(linha.querySelector('td:nth-child(2) input'), mensalidade, 'debito');  // Valor da mensalidade (débito)
    aplicarCor(linha.querySelector('td:nth-child(5) input'), seguroTaxa, 'debito');  // Seguro prestamista + taxa administrativa (débito)
    aplicarCor(linha.querySelector('td:nth-child(6) input'), outrosDebitos, 'debito');  // Outros débitos (débito)

    aplicarCor(linha.querySelector('td:nth-child(3) input'), fies, 'credito');  // Valor pago pelo FIES (crédito)
    aplicarCor(linha.querySelector('td:nth-child(4) input'), estudante, 'credito');  // Valor pago pelo estudante (crédito)
    aplicarCor(linha.querySelector('td:nth-child(7) input'), outrosCreditos, 'credito');  // Outros créditos (crédito)
}
