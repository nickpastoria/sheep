class  Player {
    constructor(scene, tags) {
        this.scene = scene;
        // this.sprite = scene.physics.add.sprite(700, 400, "shark", 0);
        this.tags = tags;
        this.sprite = scene.physics.add.sprite(game.config.width/2, game.config.height/2);
        this.sprite.play(this.tags[0].key);
        this.sprite.body.setCollideWorldBounds(true);
        this.moveSpeed = 100;
    }

    preload () {
    }

    update () {                
        // player movement
        let moveX = (-keyA.isDown + keyD.isDown);
        let moveY = (-keyW.isDown + keyS.isDown);
        this.sprite.body.setVelocityX(moveX * this.moveSpeed);
        this.sprite.body.setVelocityY(moveY * this.moveSpeed);
        
    }

}