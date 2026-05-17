// 1. LISTA DE CARTAS BASE
// Ligamos a imagem da lixeira com a imagem do objeto usando o mesmo "idPar"
const listaCartasBase = [
    // --- 10 Lixeiras ---
    { idPar: 'papel',    imagem: './img/lixeira_azul.PNG' },
    { idPar: 'vidro',    imagem: './img/lixeira_verde.PNG' },
    { idPar: 'plastico', imagem: './img/lixeira_vermelha.PNG' },
    { idPar: 'metal',    imagem: './img/lixeira_amarela.PNG' },
    { idPar: 'madeira',  imagem: './img/lixeira_preta.PNG' },
    
    { idPar: 'saude',    imagem: './img/lixeira_branca.PNG' },
    { idPar: 'perigoso', imagem: './img/lixeira_laranja.PNG' },
    { idPar: 'radioat',  imagem: './img/lixeira_roxa.PNG' },
    { idPar: 'organico', imagem: './img/lixeira_marrom.PNG' },
    { idPar: 'nao_recic',imagem: './img/lixeira_cinza.PNG' },

    // --- 10 Objetos Correspondentes ---
    { idPar: 'papel',    imagem: './img/papel.PNG' },
    { idPar: 'vidro',    imagem: './img/garrafa_vidro.PNG' },
    { idPar: 'plastico', imagem: './img/garrafa.PNG' },
    { idPar: 'metal',    imagem: './img/lata.PNG' },
    { idPar: 'madeira',  imagem: './img/madeira.PNG' },
    
    { idPar: 'saude',    imagem: './img/saude.PNG' },
    { idPar: 'perigoso', imagem: './img/pilha.PNG' },
    { idPar: 'radioat',  imagem: './img/radioativo.PNG' },
    { idPar: 'organico', imagem: './img/organico.PNG' },
    { idPar: 'nao_recic',imagem: './img/naroreciclavel.PNG' }
];

const celulas = document.querySelectorAll('.tabela_cartas td');

// Guardamos a imagem do fundo logo no início
let imgFundoOriginal = '';
if(celulas.length > 0 && celulas[0].querySelector('img')) {
    imgFundoOriginal = celulas[0].querySelector('img').getAttribute('src');
}

// Variáveis de controle do jogo
let cartaVirada = false;
let travarTabuleiro = false;
let primeiraCarta, segundaCarta;

// 2. FUNÇÃO QUE MONTA E REINICIA O JOGO
function inicializarJogo() {
    // Limpa as variáveis de controle
    resetarTabuleiro();

    // AQUI ESTÁ A MÁGICA DO EMBARALHAMENTO:
    // Criamos uma cópia da nossa lista base e usamos o Math.random para misturar as posições
    let cartasEmbaralhadas = [...listaCartasBase];
    cartasEmbaralhadas.sort(() => 0.5 - Math.random());

    // Reconstrói o HTML das cartas usando a lista que acabou de ser embaralhada
    celulas.forEach((td, index) => {
        const dadosCarta = cartasEmbaralhadas[index];

        td.innerHTML = `
            <div class="card-inner" data-par="${dadosCarta.idPar}">
                <div class="card-front">
                    <img src="${imgFundoOriginal}" alt="Fundo">
                </div>
                <div class="card-back">
                    <img src="${dadosCarta.imagem}" alt="Verso">
                </div>
            </div>
        `;
    });

    // Adiciona o evento de clique nas novas cartas geradas
    const elementosCartas = document.querySelectorAll('.card-inner');
    elementosCartas.forEach(carta => carta.addEventListener('click', virarCarta));
}

// 3. LÓGICA DO CLIQUE E VALIDAÇÃO
function virarCarta() {
    if (travarTabuleiro) return;
    if (this === primeiraCarta) return;

    this.classList.add('flip');

    if (!cartaVirada) {
        cartaVirada = true;
        primeiraCarta = this;
        return;
    }

    segundaCarta = this;
    checarCombinacao();
}

function checarCombinacao() {
    // Compara se o ID (ex: 'plastico') da carta 1 é igual ao ID da carta 2
    let combinou = primeiraCarta.dataset.par === segundaCarta.dataset.par;

    if (combinou) {
        desabilitarCartas();
    } else {
        desvirarCartas();
    }
}

function desabilitarCartas() {
    primeiraCarta.removeEventListener('click', virarCarta);
    segundaCarta.removeEventListener('click', virarCarta);
    resetarTabuleiro();
}

function desvirarCartas() {
    travarTabuleiro = true;

    setTimeout(() => {
        primeiraCarta.classList.remove('flip');
        segundaCarta.classList.remove('flip');
        resetarTabuleiro();
    }, 1000);
}

function resetarTabuleiro() {
    [cartaVirada, travarTabuleiro] = [false, false];
    [primeiraCarta, segundaCarta] = [null, null];
}

// 4. CONFIGURAÇÃO DO BOTÃO DE REINICIAR
document.getElementById('btn-reiniciar').addEventListener('click', inicializarJogo);

// Inicia o jogo automaticamente quando a página carrega
window.onload = inicializarJogo;