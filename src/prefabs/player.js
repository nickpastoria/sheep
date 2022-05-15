class  Player {
    constructor(scene, tags) {
        this.scene = scene;
        // this.sprite = scene.physics.add.sprite(700, 400, "shark", 0);
        this.tags = tags;
        this.sprite = scene.physics.add.sprite(game.config.width/2, game.config.height/2);
        this.sprite.play(this.tags[0].key);
        this.sprite.body.setCollideWorldBounds(true);
        this.moveSpeed = 100;
        this.facing = 0;
    }

    preload () {
    }

    update () {
        // player movement
        if (this.sprite.body.speed != 0){
            this.facing = Math.floor(Phaser.Math.Angle.Normalize(-this.sprite.body.angle + Math.PI/2) * (180/Math.PI) / 45);
        }
        this.sprite.play({
            key: this.tags[(this.sprite.body.speed != 0 ? (this.facing * 2) + 1 : (this.facing * 2))].key,
            repeat: -1,
            timeScale: 0.5,
        }, true)
        let moveX = (-keyA.isDown + keyD.isDown);
        let moveY = (-keyW.isDown + keyS.isDown);
        this.sprite.body.setVelocityX(moveX * this.moveSpeed);
        this.sprite.body.setVelocityY(moveY * this.moveSpeed);


    }
}