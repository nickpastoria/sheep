// we can probably make all the ending scenes use the same code but load different audio and assets in based on a certain parameter
class Ending extends Phaser.Scene {
    constructor() {
        super('ending');
    }

    preload() {

    }

    create() {
        this.events.on('transitioncomplete', () => {
                this.cameras.main.fadeIn(2000, 0, 0, 0);
                this.add.text(game.config.width/2, game.config.height/2, "this is the end!");
            }
        )
    }

}