let config = {
    type: Phaser.CANVAS,
    width:768,
    height:512,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    pixelArt: true,
    scene: [Load, Topdown, Special],
    /*
    callbacks: {
        postBoot: function(game) {
            game.canvas.style.width = '100%';
            game.canvas.style.height = '100%';
        }
    }
    */
};

let game = new Phaser.Game(config);
let keyA, keyW, keyD, keyS, keySPACE;