class  Player extends Phaser.Scene {
    constructor(scene) {
        super('player');
        scene.add.existing(this);
        this.scene = scene;
        // this.sprite = scene.physics.add.sprite(700, 400, "shark", 0);

        this.tags = scene.anims.createFromAseprite('sheep');
        this.sprite = scene.physics.add.sprite(game.config.width/2, game.config.height/2).play({key: "idle_0", repeat: -1}).setScale(2);

        this.sprite.body.setCollideWorldBounds(true);
    }

    preload () {
        this.load.aseprite('sheep', './assets/sheep.png', './assets/sheep.json');
    }

    update () {                
        // player movement
        if (keyA.isDown) {                        
            // this.sprite.x -= 2; // is the desired movement but doesn't collide 
            this.sprite.body.setAccelerationX(-100);
            this.sprite.setFlip(true, false);
        } else if (keyD.isDown) {
            // this.sprite.x += 2;
            this.sprite.body.setAccelerationX(100);
            this.sprite.resetFlip();
        } else if (keyW.isDown) {
            this.sprite.body.setAccelerationY(-100);
            this.sprite.y -= 2;
        } else if (keyS.isDown) {            
            this.sprite.body.setAccelerationY(100);    
            this.sprite.y += 2;
        }
        else {
            this.sprite.body.setAccelerationX(0);
            this.sprite.body.setDragX(600);
            this.sprite.body.setAccelerationY(0);
            this.sprite.body.setDragY(600);
        }
    }

}