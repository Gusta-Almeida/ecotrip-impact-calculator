// Fatores de emissão de CO2 em kg por km
const fatoresEmissao = {
    'carro-gasolina': 0.192,  // kg CO2/km
    'carro-etanol': 0.130,    // kg CO2/km
    'carro-diesel': 0.171,    // kg CO2/km
    'moto': 0.103,            // kg CO2/km
    'onibus': 0.089,          // kg CO2/km por passageiro
    'aviao': 0.255,           // kg CO2/km por passageiro
    'trem': 0.041             // kg CO2/km por passageiro
};

// Nomes dos meios de transporte para exibição
const nomesTransporte = {
    'carro-gasolina': 'Carro (Gasolina)',
    'carro-etanol': 'Carro (Etanol)',
    'carro-diesel': 'Carro (Diesel)',
    'moto': 'Motocicleta',
    'onibus': 'Ônibus',
    'aviao': 'Avião',
    'trem': 'Trem'
};

// Captura o formulário
const form = document.getElementById('co2Form');
const resultadoDiv = document.getElementById('resultado');

// Evento de submissão do formulário
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Coleta os valores do formulário
    const pontoA = document.getElementById('pontoA').value;
    const pontoB = document.getElementById('pontoB').value;
    const distancia = parseFloat(document.getElementById('distancia').value);
    const transporte = document.getElementById('transporte').value;
    const passageiros = parseInt(document.getElementById('passageiros').value);
    
    // Valida os dados
    if (!pontoA || !pontoB || !distancia || !transporte || !passageiros) {
        alert('Por favor, preencha todos os campos!');
        return;
    }
    
    // Calcula a emissão
    calcularEmissao(pontoA, pontoB, distancia, transporte, passageiros);
});

function calcularEmissao(pontoA, pontoB, distancia, transporte, passageiros) {
    // Obtém o fator de emissão do meio de transporte selecionado
    const fatorEmissao = fatoresEmissao[transporte];
    
    // Calcula emissão total
    let emissaoTotal = distancia * fatorEmissao;
    
    // Para transportes individuais (carros e motos), divide pela quantidade de passageiros
    let emissaoPorPassageiro;
    if (['carro-gasolina', 'carro-etanol', 'carro-diesel', 'moto'].includes(transporte)) {
        emissaoPorPassageiro = emissaoTotal / passageiros;
    } else {
        // Para transporte público, a emissão já é por passageiro
        emissaoPorPassageiro = emissaoTotal;
        emissaoTotal = emissaoTotal * passageiros;
    }
    
    // Exibe os resultados
    exibirResultado(pontoA, pontoB, distancia, transporte, emissaoTotal, emissaoPorPassageiro);
}

function exibirResultado(pontoA, pontoB, distancia, transporte, emissaoTotal, emissaoPorPassageiro) {
    // Preenche os dados no resultado
    document.getElementById('resultDistancia').textContent = `${distancia.toFixed(2)} km (${pontoA} → ${pontoB})`;
    document.getElementById('resultTransporte').textContent = nomesTransporte[transporte];
    document.getElementById('resultEmissaoTotal').textContent = `${emissaoTotal.toFixed(2)} kg CO₂`;
    document.getElementById('resultEmissaoPassageiro').textContent = `${emissaoPorPassageiro.toFixed(2)} kg CO₂`;
    
    // Cria equivalência para contextualizar
    const equivalencia = criarEquivalencia(emissaoPorPassageiro);
    document.getElementById('equivalenciaTexto').innerHTML = equivalencia;
    
    // Exibe o resultado com animação
    resultadoDiv.classList.remove('hidden');
    
    // Rola suavemente até o resultado
    resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function criarEquivalencia(emissao) {
    // Equivalências aproximadas
    const arvoresNecessarias = (emissao / 21.77).toFixed(1); // Uma árvore absorve ~21.77 kg de CO2 por ano
    const kmCarroEquivalente = (emissao / 0.192).toFixed(0); // Equivalente em km de carro a gasolina
    
    let texto = `<strong>💡 Contexto:</strong><br>`;
    texto += `• Esta emissão equivale a aproximadamente <strong>${kmCarroEquivalente} km</strong> rodados em um carro a gasolina.<br>`;
    texto += `• Seria necessário <strong>${arvoresNecessarias} ${arvoresNecessarias == 1 ? 'árvore' : 'árvores'}</strong> durante um ano inteiro para compensar esta emissão.<br>`;
    
    if (emissao < 5) {
        texto += `• ✅ <strong>Baixa emissão!</strong> Ótima escolha para o meio ambiente.`;
    } else if (emissao < 20) {
        texto += `• ⚠️ <strong>Emissão moderada.</strong> Considere alternativas mais sustentáveis quando possível.`;
    } else {
        texto += `• ❌ <strong>Alta emissão!</strong> Considere opções como transporte público ou carona solidária.`;
    }
    
    return texto;
}

// Adiciona formatação automática nos campos numéricos
document.getElementById('distancia').addEventListener('input', function(e) {
    if (this.value < 0) this.value = 0;
});

document.getElementById('passageiros').addEventListener('input', function(e) {
    if (this.value < 1) this.value = 1;
});

// Informações adicionais ao selecionar transporte
document.getElementById('transporte').addEventListener('change', function(e) {
    const transporte = this.value;
    const passageirosInput = document.getElementById('passageiros');
    
    // Ajusta sugestões de passageiros baseado no transporte
    if (transporte === 'moto') {
        passageirosInput.max = 2;
        if (parseInt(passageirosInput.value) > 2) {
            passageirosInput.value = 2;
        }
    } else if (['carro-gasolina', 'carro-etanol', 'carro-diesel'].includes(transporte)) {
        passageirosInput.max = 5;
    } else {
        passageirosInput.removeAttribute('max');
    }
});
