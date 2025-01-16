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
        const outrosDebitos = limparValor(
            linha.querySelector('td:nth-child(5) input').value
        );
        const outrosCreditos = limparValor(
            linha.querySelector('td:nth-child(6) input').value
        );

        // Calcula o valor a ser reembolsado e soma
        totalReembolso += fies + estudante - mensalidade - outrosDebitos + outrosCreditos;
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

// Adiciona o evento de click no botão "Calcular reembolso"
document
    .querySelector('button[onclick="calcularReembolso()"]')
    .addEventListener("click", calcularReembolso);

function exportarRequerimento() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Estilo e cores
    const corTituloPrincipal = "#070914"; // Cor para os títulos principais
    const corTextoSecundario = "#141A3C"; // Cor para o texto secundário
    const corTextoCelas = "#141A3C"; // Cor para o texto das células da tabela

    // Títulos gerais em Negrito
    doc.setFont("helvetica", "bold");
    doc.setTextColor(corTituloPrincipal); // Aplica a cor principal
    doc.setFontSize(18);
    doc.text("Requerimento de Reembolso", 105, 15, null, null, 'center');

    doc.setFontSize(10);
    doc.setTextColor(corTextoSecundario); // Aplica a cor secundária
    doc.text("Fundo de Financiamento Estudantil - FIES", 105, 22, null, null, 'center');

    // Seção 1 - Qualificação
    doc.setFont("helvetica", "bold");
    doc.setTextColor(corTituloPrincipal); // Cor para o título
    doc.setFontSize(12);
    doc.text("1 - Qualificação", 20, 35);

    // Dados do formulário
    const nome = document.getElementById("nome").value || "Não informado";
    const cpf = document.getElementById("cpf").value || "Não informado";
    const municipio = document.getElementById("municipio").value || "Não informado";
    const uf = document.getElementById("uf").value || "Não informado";
    const curso = document.getElementById("curso").value || "Não informado";
    const telefone = document.getElementById("telefone").value || "Não informado";
    const email = document.getElementById("email").value || "Não informado";

    let startY = 45;
    const fields = [
        { label: "Nome", value: nome },
        { label: "CPF", value: cpf },
        { label: "Município", value: municipio },
        { label: "UF", value: uf },
        { label: "Curso", value: curso },
        { label: "Telefone", value: telefone },
        { label: "E-mail", value: email },
    ];

    fields.forEach((field, index) => {
        // Título em Bold com cor secundária
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(corTextoSecundario); // Cor secundária
        doc.text(`${field.label}:`, 20, startY + index * 7);

        // Valor em Normal
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(`${field.value}`, 50, startY + index * 7);
    });

    // Seção 2 - Justificativa do pedido
    startY = startY + fields.length * 7 + 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(corTituloPrincipal); // Cor para o título
    doc.text("2 - Justificativa do pedido", 20, startY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(corTextoSecundario); // Cor secundária
    const justificativa = "Com fundamento na Portaria Normativa MEC nº 209, de 07 de março de 2018, artigo 58, § 6º...";
    doc.text(justificativa, 20, startY + 7, { maxWidth: 170 });

    // Seção 3 - Demonstrativo financeiro
    startY = startY + 20; // Ajustar Y após a justificativa
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(corTituloPrincipal); // Cor para o título
    doc.text("3 - Demonstrativo financeiro", 20, startY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(corTextoSecundario); // Cor secundária
    const demonstrativo = "Insira os dados na tabela abaixo e clique em 'Calcular reembolso'. Após o cálculo, clique em 'Exportar requerimento' para gerar o documento.";
    doc.text(demonstrativo, 20, startY + 7, { maxWidth: 170 });

    // Adicionar tabela de valores
    startY = startY + 20; // Ajustar Y após o demonstrativo
    doc.autoTable({
        head: [
            [
                'Mês/Ano',
                'Valor da mensalidade',
                'Valor pago pelo FIES',
                'Valor pago pelo estudante',
                'Outros Débitos',
                'Outros Créditos',
            ],
        ],
        body: Array.from(document.querySelectorAll("table tbody tr")).map(linha => [
            linha.querySelector('td:nth-child(1) select').value || "-",
            `${linha.querySelector('td:nth-child(2) input').value || '0,00'}`,
            `${linha.querySelector('td:nth-child(3) input').value || '0,00'}`,
            `${linha.querySelector('td:nth-child(4) input').value || '0,00'}`,
            `${linha.querySelector('td:nth-child(5) input').value || '0,00'}`,
            `${linha.querySelector('td:nth-child(6) input').value || '0,00'}`,
        ]),
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
            1: { cellWidth: 32 },
            2: { cellWidth: 32 },
            3: { cellWidth: 32 },
            4: { cellWidth: 32 },
            5: { cellWidth: 32 },
        },
    });

    // Título "Valor Total a Ser Reembolsado" em Bold com cor principal
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(corTituloPrincipal); // Cor para o título principal
    const totalReembolso = document.getElementById("totalReembolso").textContent || "R$ 0,00";
    doc.text(`Valor Total a Ser Reembolsado: ${totalReembolso}`, 20, doc.lastAutoTable.finalY + 10);

    // Detalhes adicionais com cor secundária
    const outrosDetalhes = document.getElementById("outros-detalhes").value || "Nenhum detalhe adicional informado.";
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(corTextoSecundario); // Cor secundária
    doc.text("Detalhes adicionais:", 20, doc.lastAutoTable.finalY + 20);
    doc.setFontSize(9);
    doc.text(outrosDetalhes, 20, doc.lastAutoTable.finalY + 30, { maxWidth: 170 });

    // Salvar o PDF
    doc.save('requerimento_reembolso.pdf');
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

    // Ordenar em ordem crescente
    semestres.sort((a, b) => {
        const [semestreA, anoA] = a.split("/");
        const [semestreB, anoB] = b.split("/");
        return parseInt(anoA) - parseInt(anoB) || parseInt(semestreA) - parseInt(semestreB);
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

