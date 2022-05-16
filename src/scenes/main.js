
let config = {
    type: Phaser.CANVAS,
    width:384,
    height:256,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        }
    },
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,
        zoom: Phaser.Scale.ZOOM_2X,
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