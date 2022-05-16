// For special-type gameplay scenes (no top-down control)
// We probably have to make a new .js for each special scene we put in the game since the animation handling is too specific.
// We can still template fades and the logic.
class Special extends Phaser.Scene {
    constructor() {
        super('special');
    }

    preload() {
        this.load.aseprite('sheep_close', './assets/sheep_close.png', './assets/sheep_close.json');
        this.load.aseprite('door', './assets/door.png', './assets/door.json');
    }

    create() {
        // create animations, tags
        this.sheep_tags = this.anims.createFromAseprite('sheep_close');
        this.door_tags = this.anims.createFromAseprite('door');
        this.cameras.main.setBackgroundColor('000000');
        this.cameras.main.fadeIn(2000, 0, 0, 0);

        this.door = this.add.sprite(game.config.width/2, 16, 'door',).setOrigin(0.5, 0);
        this.sheep = this.add.sprite(game.config.width/2, game.config.height).setOrigin(0.5,1).play({key: this.sheep_tags[0].key, repeat: -1, yoyo: true, timeScale: 0.25});
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.choices = ['ending', 'topdown'];
        this.selection = 0;
        this.transitioning = true;

        this.cameras.main.on(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, (cam, effect) => {
            this.transitioning = false;
        })
    }

    update() {
        if (!this.transitioning) {
            if (Phaser.Input.Keyboard.JustDown(keyA)) {
                if (this.door.anims.isPlaying && !this.door.anims.inReverse) {
                    this.door.anims.reverse();
                } else if (this.selection != 0)
                {
                    this.door.playReverse({key: this.door_tags[0].key,}, true);
                }

                this.selection = Math.max(0, this.selection - 1);
            }
            else if (Phaser.Input.Keyboard.JustDown(keyD)) {
                if (this.door.anims.isPlaying && this.door.anims.inReverse) {
                    this.door.anims.reverse();
                }
                else if (this.selection != 1)
                {
                    this.door.play({key: this.door_tags[0].key,}, true);
                }

                this.selection = Math.min(this.choices.length - 1, this.selection + 1);
            }
            else if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
                this.transitioning = true;
                this.scene.transition({target: this.choices[this.selection], duration: 2000,});
                this.cameras.main.fade(2000, 0, 0, 0);
            }
        }
    }
}