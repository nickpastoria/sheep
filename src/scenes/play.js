class Play extends Phaser.Scene {
    constructor() {
        super("play");
    }

    create () {
        // // keys
        // keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        // keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        // keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        // keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);    
    }

    update () {
        this.scene.start('topdown');
    }

}