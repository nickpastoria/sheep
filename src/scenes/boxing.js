class Boxing extends Phaser.Scene {
    constructor() {
        super('boxing');
    }

    preload() {
        this.load.aseprite('boxer', './assets/boxer.png', './assets/boxer.json');
        this.load.aseprite('fist', './assets/fist.png', './assets/fist.json');
        this.load.aseprite('sheep_close', './assets/sheep_close.png', './assets/sheep_close.json');
    }

    create() {
        this.sheep_tags = this.anims.createFromAseprite('sheep_close');
        this.boxer_tags = this.anims.createFromAseprite('boxer');
        this.fist_tags = this.anims.createFromAseprite('fist');
        this.cameras.main.setBackgroundColor("000000");
        this.cameras.main.fadeIn(2000, 0, 0, 0);

        this.boxer = this.add.sprite(game.config.width/2, 128, 'boxer',).setOrigin(0.5);
        this.boxer.play({
            key: this.boxer_tags[0].key, 
            repeat: -1, 
            yoyo: true, 
            timeScale: 0.25
        });

        this.fistL = this.add.sprite(game.config.width/2, 128, 'fist');
        this.fistR = this.add.sprite(game.config.width/2, 128, 'fist').setFlipX(true);
        
        this.sheep = this.add.sprite(game.config.width/2, game.config.height).setOrigin(0.5,1);
        this.sheep.play({
            key: this.sheep_tags[0].key, 
            repeat: -1, 
            yoyo: true, 
            timeScale: 0.25
        });

        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.hits = 0;
        this.magnitude = 0;
        this.punchLeft = true;

        this.transitioning = true;
        this.cameras.main.on(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, (cam, effect) => {
            this.transitioning = false;

            // ending selection logic
            this.clock = this.time.delayedCall(6500, () => {
                let target = 'special'
                if (this.hits >= 200) {
                    target = 'ending'; // make this go to a special ending
                }
                else if (this.hits >= 100) {
                    target = 'ending'; // normal ending
                }
                else {
                    target = 'gameover';
                }
                this.transitioning = true;
                this.scene.transition({target: target, duration: 2000,});
                this.cameras.main.fade(2000, 0, 0, 0);
            }, null, this);
        })

        // boxer damage animation
        this.fistL.on(Phaser.Animations.Events.ANIMATION_UPDATE, (anim, frame, sprite, frameKey) => {
            if (frameKey == '2') {
                this.boxer.setFlipX(false);
                this.boxer.play({
                    key: this.boxer_tags[1].key, 
                    timeScale:1.25
                });
            }
        });
        this.fistR.on(Phaser.Animations.Events.ANIMATION_UPDATE, (anim, frame, sprite, frameKey) => {
            if (frameKey == '2') {
                this.boxer.setFlipX(true);
                this.boxer.play({
                    key: this.boxer_tags[1].key, 
                    timeScale:1.25
                });
            }
        });

        // reset to idle from damage animation
        this.boxer.on(Phaser.Animations.Events.ANIMATION_COMPLETE, (anim, frame, sprite, frameKey) => {
            if (anim.key == this.boxer_tags[1].key) {
                this.boxer.play({
                    key: this.boxer_tags[0].key, 
                    repeat: -1, 
                    yoyo: true, 
                    timeScale: 0.25
                });
            }
        })
    }

    update() {
        if (!this.transitioning) {
            if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
                this.hits += 1;
                this.magnitude += 2;
                this.magnitude = Math.min(this.magnitude, 50);
                if (this.punchLeft) {
                    this.fistL.play({
                        key:this.fist_tags[0].key, 
                        timeScale: .75 + this.magnitude/50
                    });
                }
                else {
                    this.fistR.play({
                        key:this.fist_tags[0].key, 
                        timeScale: .75 + this.magnitude/50
                    });
                }
                this.punchLeft = !this.punchLeft;
            }
            this.magnitude = Math.max(0, this.magnitude - this.magnitude/100);
        }
    }
}