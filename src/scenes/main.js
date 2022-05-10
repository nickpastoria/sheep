let config = {
    type: Phaser.CANVAS,
    width:1024,
    height:576,
    physics: {
        default: 'arcade',
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    pixelArt: true,
    scene: [Topdown, Event],
    callbacks: {
        postBoot: function(game) {
            game.canvas.style.width = '100%';
            game.canvas.style.height = '100%';
        }
    }
};

let game = new Phaser.Game(config);
let keyA, keyW, keyD, keyS, keySPACE;
