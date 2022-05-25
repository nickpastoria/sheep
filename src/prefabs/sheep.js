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
        this.i = 0;
        this.j = 1;
    }

    preload () {
    }

    update (moving, path, startFacing, x, y) {
        console.log("sx ", this.sprite.body.x, "sy ", this.sprite.body.y);
        // moving 
        if (moving) {               
            
            let px, py;
            this.scene.physics.moveTo(this.sprite, path[this.i], path[this.j], 60, 3000);

            if (!(this.i + 2 == path.length)) {
                if (this.withinRange(this.sprite.body.x, this.sprite.body.y, path[this.i], path[this.j])) {
                    this.i += 2; this.j += 2;                    
                    // px = path[i];
                    // py = path[j];
                    this.scene.physics.moveTo(this.sprite, path[this.i], path[this.j], 60, 3000);
                    console.log("Moving to next point");
                }
            
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
        }

        // facing
        if (startFacing) {    
            this.angleTo = Phaser.Math.Angle.Between(this.sprite.body.x, this.sprite.body.y, x, y);
            this.doFace(this.angleTo);
        }
    }

    withinRange (sheepX, sheepY, x, y) {
        console.log("sx,sy,x,y: ", sheepX, sheepY, x, y);
        let x_dst = Math.abs(sheepX - x);
        let y_dst = Math.abs(sheepY - y);
        console.log("x_dst: ", x_dst, "y_dst ", y_dst);

        if (x_dst < 20 && y_dst < 20) {
            console.log("withinRange");
            return true;
        }
        return false;
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