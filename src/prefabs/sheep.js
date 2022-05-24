class Sheep {
    constructor(scene, tags, x, y, face) {
        this.scene = scene;
        this.tags = tags;
        this.sprite = scene.physics.add.sprite(x, y);
        this.sprite.play(this.tags[face].key);
        this.sprite.body.setCollideWorldBounds(true);
        this.sprite.body.setSize(23, 26, false);
        this.sprite.body.setOffset(6,3);
        this.moveSpeed = 100;
        this.facing = 0;
        this.face = 0;
    }

    preload () {
    }

    update (moving, startFacing, x, y) {

        // moving 
        if (moving) {   
             this.scene.physics.moveTo(this.sprite, x, y);

            if (this.sprite.body.speed != 0){
                this.facing = Math.floor(Phaser.Math.Angle.Normalize(-this.sprite.body.angle + Math.PI/2) * (180/Math.PI) / 45);
                // console.log("facing", this.facing);
            }        
            this.sprite.play({
                key: this.tags[(this.sprite.body.speed != 0 ? (this.facing * 2) + 1 : (this.facing * 2))].key,
                repeat: -1,
                timeScale: 0.5,
            }, true)
        }

        // facing
        if (startFacing) {    
            this.angleTo = Phaser.Math.Angle.Between(this.sprite.body.x, this.sprite.body.y, x, y);
            this.doFace(this.angleTo);
        }
    }



    
    doFace (angle) {
        if (0.4 > angle && angle > -0.06) {
            this.face = 4;
        }
        else if (-0.06 > angle && angle > -1.1) {
            this.face = 6;
        }
        else if (-1.1 > angle && angle > -1.6) {
            this.face = 8;
        }
        else if (-1.6 > angle && angle > -3) {
            this.face = 10;
        }
        else if (2.7 > angle && angle > 1.6) {
            this.face = 14;
        }
        else if (1.6 > angle && angle > 1.0) {
            this.face = 0;
        }
        else if (1.0 > angle && angle > 0.4) {
            this.face = 2;
        }
        else {
            this.face = 12;
        }

        this.sprite.play({
            key: this.tags[this.face].key,
            repeat: -1,
            timeScale: 0.5,
        }, true)
    }
}