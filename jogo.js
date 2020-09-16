let frames = 0;

const som_HIT = new Audio();
som_HIT.src = './efeitos/hit.wav';


const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

function criaFlappyBird() {
    const flappyBird = {
        spriteX: 0,
        spriteY: 0,
        largura: 33,
        altura: 24,
        x: 10,
        y: 50,
        gravidade: 0.25,
        velocidade: 0,
        pulo: 4.6,
        pula() {
            flappyBird.velocidade = - flappyBird.pulo;
        },
        atualiza() {

            if (fazColizao(flappyBird, globais.chao)) {
                console.log("fez colisao");

                som_HIT.play();

                setTimeout(() => {
                    mudaParaTela(Telas.INICIO);
                }, 500);

                return;
            }

            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
            flappyBird.y = flappyBird.y + flappyBird.velocidade;
        },
        movimentos: [
            { spriteX: 0, spriteY: 0 },
            { spriteX: 0, spriteY: 26 },
            { spriteX: 0, spriteY: 52 },
        ],
        frameAtual: 0,
        atualizarOFrameAtual() {

            const intervaloDeFrames = 10;
            const passouOIntervalo = frames % intervaloDeFrames === 0;

            if (passouOIntervalo) {
                const baseDoIncremento = 1;
                const incremento = baseDoIncremento + flappyBird.frameAtual;
                const baseRepeticao = flappyBird.movimentos.length;
                flappyBird.frameAtual = incremento % baseRepeticao;
            }
        },
        desenhar() {

            flappyBird.atualizarOFrameAtual();

            const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual];

            contexto.drawImage(
                sprites,
                spriteX, spriteY, // sprite x, sprite y
                flappyBird.largura, flappyBird.altura, // tamanho do recorte na sprite
                flappyBird.x, flappyBird.y,
                flappyBird.largura, flappyBird.altura
            );
        },
    };

    return flappyBird;
}

function criaChao() {
    const chao = {
        spriteX: 0,
        spriteY: 610,
        largura: 224,
        altura: 112,
        x: 0,
        y: canvas.height - 112,
        atualiza() {
            const movimentoDoChao = 1;
            const repeteEm = chao.largura / 2;
            const movimentacao = chao.x - movimentoDoChao;

            chao.x = movimentacao % repeteEm;
        },
        desenhar() {
            contexto.drawImage(
                sprites,
                chao.spriteX, chao.spriteY, // sprite x, sprite y
                chao.largura, chao.altura, // tamanho do recorte na sprite
                chao.x, chao.y,
                chao.largura, chao.altura
            );

            contexto.drawImage(
                sprites,
                chao.spriteX, chao.spriteY, // sprite x, sprite y
                chao.largura, chao.altura, // tamanho do recorte na sprite
                (chao.x + chao.largura), chao.y,
                chao.largura, chao.altura
            );

        },
    };
    return chao;
};

function criaCanos() {
    const canos = {
        largura: 52,
        altura: 400,
        chao: {
            spriteX: 0,
            spriteY: 169,
        },
        ceu: {
            spriteX: 52,
            spriteY: 169,
        },
        espaco: 80,
        pares: [],
        desenhar() {
            canos.pares.forEach(function (par) {

                const yRandom = par.y;
                const espacamentoEntreCanos = 90;

                // Cano do Céu
                const canoCeuX = par.x;
                const canoCeuY = yRandom;

                contexto.drawImage(
                    sprites,
                    canos.ceu.spriteX, canos.ceu.spriteY,
                    canos.largura, canos.altura,
                    canoCeuX, canoCeuY,
                    canos.largura, canos.altura,
                );
                // Cano do Chão
                const canoChaoX = par.x;
                const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom;

                contexto.drawImage(
                    sprites,
                    canos.chao.spriteX, canos.chao.spriteY,
                    canos.largura, canos.altura,
                    canoChaoX, canoChaoY,
                    canos.largura, canos.altura,
                );

                par.canoCeu = {
                    x: canoCeuX,
                    y: canos.altura + canoCeuY,
                }

                par.canoChao = {
                    x: canoChaoX,
                    y: canoChaoY,
                }
            })
        },
        temColisaoComOFlappyBird(par) {

            const cabecaDoFlappy = globais.flappyBird.y;
            const peDoFlappy = globais.flappyBird.y + globais.flappyBird.altura;

            if (globais.flappyBird.x >= par.x) {
                if (cabecaDoFlappy <= par.canoCeu.y) {
                    return true;
                }

                if (peDoFlappy >= par.canoChao.y) {
                    return true;
                }
            }

            return false;
        },
        atualiza() {

            const passou100frames = frames % 100 === 0;
            if (passou100frames) {
                canos.pares.push({
                    x: canvas.width,
                    y: -150 * (Math.random() + 1),
                })
            }

            canos.pares.forEach(function (par) {
                par.x = par.x - 2;

                if (canos.temColisaoComOFlappyBird(par)) {
                    mudaParaTela(Telas.INICIO);
                }

                if (par.x + canos.largura <= 0) {
                    canos.pares.shift();
                }
            });

        }
    };

    return canos;
};

const planoDeFundo = {
    spriteX: 390,
    spriteY: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height - 204,
    desenhar() {
        contexto.fillStyle = '#70c5ce';
        contexto.fillRect(0, 0, canvas.width, canvas.height);

        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY, // sprite x, sprite y
            planoDeFundo.largura, planoDeFundo.altura, // tamanho do recorte na sprite
            planoDeFundo.x, planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura
        );

        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY, // sprite x, sprite y
            planoDeFundo.largura, planoDeFundo.altura, // tamanho do recorte na sprite
            (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura
        );

    },
}

function fazColizao(flappyBird, chao) {

    const flappyBirdY = flappyBird.y + flappyBird.altura;
    const chaoY = chao.y;

    if (flappyBirdY >= chaoY) {
        return true;
    }
    else {
        return false;
    }
}

const mensagemGetReady = {
    sX: 134,
    sY: 0,
    w: 174,
    h: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,
    desenhar() {
        contexto.drawImage(
            sprites,
            mensagemGetReady.sX, mensagemGetReady.sY,
            mensagemGetReady.w, mensagemGetReady.h,
            mensagemGetReady.x, mensagemGetReady.y,
            mensagemGetReady.w, mensagemGetReady.h
        );
    },

};

//
// Telas
// 
const globais = {};
let telaAtiva = {};

function mudaParaTela(novaTela) {
    telaAtiva = novaTela;

    telaAtiva = novaTela;
    if (telaAtiva.inicializa) {
        telaAtiva.inicializa();
    }
};

const Telas = {
    INICIO: {
        inicializa() {
            globais.flappyBird = criaFlappyBird();
            globais.canos = criaCanos();
            globais.chao = criaChao();
        },
        desenha() {
            planoDeFundo.desenhar();
            globais.flappyBird.desenhar();
            globais.chao.desenhar();
            mensagemGetReady.desenhar();
        },
        atualiza() {
            globais.chao.atualiza();
        },
        click() {
            mudaParaTela(Telas.JOGO);
        }
    }
}

Telas.JOGO = {
    desenha() {
        planoDeFundo.desenhar();
        globais.canos.desenhar();
        globais.chao.desenhar();
        globais.flappyBird.desenhar();
    },
    click() {
        globais.flappyBird.pula();
    },
    atualiza() {
        globais.canos.atualiza();
        globais.flappyBird.atualiza();
    },
}

function loop() {

    telaAtiva.desenha();
    telaAtiva.atualiza();

    frames = frames + 1;
    requestAnimationFrame(loop);
};

window.addEventListener('click', function () {
    if (telaAtiva.click) {
        telaAtiva.click();
    }
})

mudaParaTela(Telas.INICIO);
loop();