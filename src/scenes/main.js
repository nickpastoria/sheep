// Boxing Gloves - Left Handed by Gohar Munir, licensed under CC 4.0
// https://sketchfab.com/3d-models/boxing-gloves-left-handed-076293541203455da59a38eea5b6a44b
// https://creativecommons.org/licenses/by/4.0/
// Converted to 2D sprite in image editing software.
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
    scene: [Load, Street1, Topdown, Special, Boxing, GameOver, Ending],
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