// 1. LISTA DE CARTAS BASE
// Ligamos a imagem da lixeira com a imagem do objeto usando o mesmo "idPar"
const listaCartasBase = [
    // --- 10 Lixeiras ---
    { idPar: 'papel',    imagem: 'https://igjoee.github.io/EcoHub.github.io/img/lixeira_azul.png' },
    { idPar: 'vidro',    imagem: 'https://igjoee.github.io/EcoHub.github.io/img/lixeira_verde.png' },
    { idPar: 'plastico', imagem: 'https://igjoee.github.io/EcoHub.github.io/img/lixeira_vermelha.png' },
    { idPar: 'metal',    imagem: 'https://igjoee.github.io/EcoHub.github.io/img/lixeira_amarela.png' },
    { idPar: 'madeira',  imagem: 'https://igjoee.github.io/EcoHub.github.io/img/lixeira_preta.png' },
    
    { idPar: 'saude',    imagem: 'https://igjoee.github.io/EcoHub.github.io/img/lixeira_branca.png' },
    { idPar: 'perigoso', imagem: 'https://igjoee.github.io/EcoHub.github.io/img/lixeira_laranja.png' },
    { idPar: 'radioat',  imagem: 'https://igjoee.github.io/EcoHub.github.io/img/lixeira_roxa.png' },
    { idPar: 'organico', imagem: 'https://igjoee.github.io/EcoHub.github.io/img/lixeira_marrom.png' },
    { idPar: 'nao_recic',imagem: 'https://igjoee.github.io/EcoHub.github.io/img/lixeira_cinza.png' },

    // --- 10 Objetos Correspondentes ---
    { idPar: 'papel',    imagem: 'https://igjoee.github.io/EcoHub.github.io/img/papel.png' },
    { idPar: 'vidro',    imagem: 'https://igjoee.github.io/EcoHub.github.io/img/garrafa_vidro.png' },
    { idPar: 'plastico', imagem: 'https://igjoee.github.io/EcoHub.github.io/img/garrafa.png' },
    { idPar: 'metal',    imagem: 'https://igjoee.github.io/EcoHub.github.io/img/lata.png' },
    { idPar: 'madeira',  imagem: 'https://igjoee.github.io/EcoHub.github.io/img/madeira.png' },
    
    { idPar: 'saude',    imagem: 'https://igjoee.github.io/EcoHub.github.io/img/saude.png' },
    { idPar: 'perigoso', imagem: 'https://igjoee.github.io/EcoHub.github.io/img/pilha.png' },
    { idPar: 'radioat',  imagem: 'https://igjoee.github.io/EcoHub.github.io/img/radioativo.png' },
    { idPar: 'organico', imagem: 'https://igjoee.github.io/EcoHub.github.io/img/organico.png' },
    { idPar: 'nao_recic',imagem: 'https://igjoee.github.io/EcoHub.github.io/img/naroreciclavel.png' }
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