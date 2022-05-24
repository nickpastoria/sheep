class GameOver extends Phaser.Scene {
    constructor() {
        super('gameover');
    }
    preload() {
        this.load.aseprite('dizzy', "./assets/dizzy_sheep.png", './assets/dizzy_sheep.json');
        this.load.aseprite('countdown', './assets/countdown.png', './assets/countdown.json');
    }
}