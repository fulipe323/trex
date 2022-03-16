var solo, soloimagem, soloinvisivel;
var trex, trex_correndo, colidido;

var nuvemIMG;
var o1, o2, o3, o4, o5, o6;

var grupoCacto, grupoNuvem;

var gameOver, gameOverImagem;
var restartImagem, restart;

var somPulo;
var somCheckPoint;
var somMorte;

var JOGAR = 1;
var FIM = 0;
var estadoDeJogo = JOGAR;

var ponto = 0;

function preload() {

    //carrega as imagens 
    soloimagem = loadImage("solo.png");
    gameOverImagem = loadImage("gameOver.png");
    restartImagem = loadImage("restart.png");
    nuvemIMG = loadImage("nuvem.png");
    o1 = loadImage("obstaculo1.png");
    o2 = loadImage("obstaculo2.png");
    o3 = loadImage("obstaculo3.png");
    o4 = loadImage("obstaculo4.png");
    o5 = loadImage("obstaculo5.png");
    o6 = loadImage("obstaculo6.png");

    //carrega as animações
    colidido = loadAnimation("trex_colidido.png");
    trex_correndo = loadAnimation("trex1.png", "trex2.png", "trex3.png");

    //carrega os sons
    somPulo = loadSound("jump.mp3");
    somCheckPoint = loadSound("checkPoint.mp3");
    somMorte = loadSound("die.mp3");

}

function setup() {
    //area de jogo
    createCanvas(windowWidth, windowHeight);

    //sprite: solo
    solo = createSprite(width / 2, height - 20, width * 1.5, 20);
    solo.addImage(soloimagem);
    solo.velocityX = -3;

    //sprite: solo invisível
    soloinvisivel = createSprite(width / 2, height - 10, width, 10);
    soloinvisivel.visible = false;

    //sprite: game over
    gameOver = createSprite(width / 2, height / 2);
    gameOver.addImage(gameOverImagem);
    gameOver.scale = 0.5;

    //sprite: restart
    restart = createSprite(width / 2, height / 2 + 30);
    restart.addImage(restartImagem);
    restart.scale = 0.5;

    //sprite: trex
    trex = createSprite(50, height - 70, 50, 50);
    trex.addAnimation("trex correndo", trex_correndo);
    trex.addAnimation("colidido", colidido);
    trex.setCollider("circle", 0, 0, 50);
    trex.scale = 0.5;
    //grupos
    grupoCacto = new Group();
    grupoNuvem = new Group();

}

function draw() {

    background("white");
    fill("black");
    text("Pontuação: " + ponto, width - 180, height / 8);

    if (estadoDeJogo == JOGAR) {

        gameOver.visible = false;
        restart.visible = false;

        trex.changeAnimation("trex correndo");

        //Código que verifica se a pessoa apertou espaço
        if ((touches.length > 0 || keyDown("space")) && trex.y > height - 120) {
            trex.velocityY = -10;
            somPulo.play();
            touches = [];
        }

        ponto += Math.round(getFrameRate() / 60);

        if (ponto % 100 == 0 && ponto > 0) {
            somCheckPoint.play();
        }

        solo.velocityX = -(4 + ponto / 100);

        if (solo.x < 0) {
            solo.x = solo.width / 2;
        }

        gerarCactos();
        gerarNuvens();

        if (trex.isTouching(grupoCacto)) {
            somMorte.play();
            estadoDeJogo = FIM;
        }

    }

    if (estadoDeJogo == FIM) {

        gameOver.visible = true;
        restart.visible = true;
        solo.velocityX = 0;

        trex.changeAnimation("colidido");
        grupoCacto.setVelocityXEach(0);
        grupoNuvem.setVelocityXEach(0);
        grupoCacto.setLifetimeEach(-1);
        grupoNuvem.setLifetimeEach(-1);

        //comando que verifica se restart foi clicada
        if (touches.length > 0 || mousePressedOver(restart)) {
            reset();
            touches = [];
        }

    }
    trex.velocityY += 0.5;
    trex.collide(soloinvisivel);

    drawSprites();

}

function gerarNuvens() {

    if (frameCount % 60 == 0) {
        var y = Math.round(random(1, height / 2));
        var nuvem = createSprite(width, y, 40, 10);
        nuvem.addImage(nuvemIMG);
        nuvem.velocityX = -3;
        nuvem.scale = 0.5;
        trex.depth = nuvem.depth + 1;
        nuvem.lifetime = width / nuvem.velocityX;
        grupoNuvem.add(nuvem);

    }
}


function gerarCactos() {

    if (frameCount % 60 == 0) {
        var o = Math.round(random(1, 6));
        var obs = createSprite(width, height - 20, 10, 40);
        obs.velocityX = solo.velocityX;

        switch (o) {
            case 1:
                obs.addImage(o1);
                break;
            case 2:
                obs.addImage(o2);
                break;
            case 3:
                obs.addImage(o3);
                break;
            case 4:
                obs.addImage(o4);
                break;
            case 5:
                obs.addImage(o5);
                break;
            case 6:
                obs.addImage(o6);
                break;
        }
        obs.scale = 0.4;
        obs.lifetime = width / obs.velocityX;
        grupoCacto.add(obs);
    }
}

function reset() {
    estadoDeJogo = JOGAR;
    grupoCacto.destroyEach();
    grupoNuvem.destroyEach();
    ponto = 0;
}