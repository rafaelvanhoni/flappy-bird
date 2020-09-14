console.log("Teste Rafael");

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');


const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height - 112,
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

const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    largura: 33,
    altura: 24,
    x: 10,
    y: 50,
    gravidade: 0.25,
    velocidade: 0,
    atualiza() {
        flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
        console.log(flappyBird.velocidade);
        console.log(flappyBird.gravidade);
        flappyBird.y = flappyBird.y + flappyBird.velocidade;
    },
    desenhar() {
        contexto.drawImage(
            sprites,
            flappyBird.spriteX, flappyBird.spriteY, // sprite x, sprite y
            flappyBird.largura, flappyBird.altura, // tamanho do recorte na sprite
            flappyBird.x, flappyBird.y,
            flappyBird.largura, flappyBird.altura
        );
    },
};

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

let telaAtiva = {};

function mudaParaTela(novaTela) {
    telaAtiva = novaTela;
};

const Telas = {
    INICIO: {
        desenha() {
        planoDeFundo.desenhar();
        chao.desenhar();
        flappyBird.desenhar();
        mensagemGetReady.desenhar();
        },
        atualiza() {

        },
        click(){
            mudaParaTela(Telas.JOGO);
        }
    }
}

Telas.JOGO = {
    desenha() {
        planoDeFundo.desenhar();
        chao.desenhar();
        flappyBird.desenhar();
    },
    atualiza() {
        flappyBird.atualiza();
    },
}

function loop() {

    telaAtiva.desenha();
    telaAtiva.atualiza();

    requestAnimationFrame(loop);
};

window.addEventListener('click', function(){
    if(telaAtiva.click){
        telaAtiva.click();
    }
})

mudaParaTela(Telas.INICIO);
loop();