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
    linhas.forEach(function(linha) {
        const mensalidade = parseFloat(linha.querySelector('td:nth-child(2) input').value) || 0;
        const fies = parseFloat(linha.querySelector('td:nth-child(3) input').value) || 0;
        const estudante = parseFloat(linha.querySelector('td:nth-child(4) input').value) || 0;

        // Calcula o valor a ser reembolsado e soma
        totalReembolso += (fies + estudante - mensalidade);
    });

    // Atualiza o valor total na página
    document.getElementById('totalReembolso').innerText = `R$ ${totalReembolso.toFixed(2)}`;
}

// Adiciona o evento de click no botão "Calcular reembolso"
document.querySelector('button[onclick="calcularReembolso()"]').addEventListener('click', calcularReembolso);


// Função para exportar o requerimento para PDF
function exportarRequerimento() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Adicionar título
    doc.setFontSize(16);
    doc.text("Requerimento de Reembolso", 20, 20);
    doc.setFontSize(12);
    doc.text("Fundo de Financiamento Estudantil - FIES", 20, 30);

    // Adicionar dados do formulário
    const nome = document.getElementById("nome").value;
    const cpf = document.getElementById("cpf").value;
    const municipio = document.getElementById("municipio").value;
    const uf = document.getElementById("uf").value;
    const curso = document.getElementById("curso").value;
    const telefone = document.getElementById("telefone").value;
    const email = document.getElementById("email").value;

    doc.text(`Nome: ${nome}`, 20, 40);
    doc.text(`CPF: ${cpf}`, 20, 50);
    doc.text(`Município: ${municipio}`, 20, 60);
    doc.text(`UF: ${uf}`, 20, 70);
    doc.text(`Curso: ${curso}`, 20, 80);
    doc.text(`Telefone: ${telefone}`, 20, 90);
    doc.text(`E-mail: ${email}`, 20, 100);

    // Adicionar tabela de valores
    const linhas = document.querySelectorAll("table tbody tr");
    let startY = 110;
    doc.text("Mês/Ano", 20, startY);
    doc.text("Valor da mensalidade", 60, startY);
    doc.text("Valor pago pelo FIES", 120, startY);
    doc.text("Valor pago pelo estudante", 180, startY);

    startY += 10;

    linhas.forEach((linha, index) => {
        const mesAno = linha.querySelector('td:nth-child(1) select').value;
        const valorMensalidade = linha.querySelector('td:nth-child(2) input').value;
        const valorFIES = linha.querySelector('td:nth-child(3) input').value;
        const valorEstudante = linha.querySelector('td:nth-child(4) input').value;

        doc.text(`${mesAno}`, 20, startY);
        doc.text(`R$ ${valorMensalidade}`, 60, startY);
        doc.text(`R$ ${valorFIES}`, 120, startY);
        doc.text(`R$ ${valorEstudante}`, 180, startY);

        startY += 10;
    });

    // Adicionar valor total a ser reembolsado
    const totalReembolso = document.getElementById("totalReembolso").textContent;
    doc.text(`Valor Total a Ser Reembolsado: ${totalReembolso}`, 20, startY + 10);

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
        "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
    ];
    
    // Seleciona o campo de UF no HTML
    const selectUF = document.getElementById('uf');

    // Adiciona uma opção padrão no início
    let option = document.createElement('option');
    option.text = 'Selecione';
    option.value = '';
    selectUF.add(option);

    // Preenche o campo com as opções de UF
    ufs.forEach(function(uf) {
        let option = document.createElement('option');
        option.text = uf;
        option.value = uf;
        selectUF.add(option);
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

document.addEventListener('DOMContentLoaded', () => {
    preencherSemestres();
});

function preencherSemestres() {
    const selectSemestre = document.getElementById("semestre");

    // Data atual
    const dataAtual = new Date();
    const anoAtual = dataAtual.getFullYear();
    const mesAtual = dataAtual.getMonth() + 1; // Janeiro é 0, adicionamos 1

    // Determinar os dois semestres anteriores
    let semestres = [];
    if (mesAtual <= 6) {
        // Estamos no 1º semestre
        semestres.push(`02/${anoAtual - 1}`, `01/${anoAtual - 1}`);
    } else {
        // Estamos no 2º semestre
        semestres.push(`01/${anoAtual}`, `02/${anoAtual - 1}`);
    }

    // Adicionar opções no select
    selectSemestre.innerHTML = ""; // Limpar opções existentes

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
