class Sheep {
    constructor(scene, tags, x, y, face) {
        this.scene = scene;
        this.tags = tags;
        this.sprite = scene.physics.add.sprite(x, y);
        this.sprite.play(this.tags[face].key);
        this.sprite.body.setCollideWorldBounds(true);
        this.sprite.body.setSize(20, 26, false); // 23, 26, F
        this.sprite.body.setOffset(6, 3);
        this.moveSpeed = 100;
        this.facing = 0;
        this.face = 0;

        this.keepPathing = true;        
        this.i = 0;
        this.j = 1;
    }

    preload() {
    }

    update(moving, gotoStart, jumpttoStart, pause, path, startFacing, x, y) {
        // console.log("Sheep: ", this.sprite.body.x, this.sprite.body.y);

        if (moving) {
            
            // touching left
            // if (this.sprite.body.touching.left) {
            //     this.sprite.body.x += 1
            // }
            // if (this.sprite.body.touching.right) {
            //     this.sprite.body.x -= 1
            // }
            // if (this.sprite.body.touching.top) {
            //     this.sprite.body.x += 1
            // }
            // if (this.sprite.body.touching.down) {
            //     this.sprite.body.x -= 1
            // }

            
            if (!pause) {
                if (this.keepPathing) {
                    // gotoPoint
                    this.gotoPoint(this.sprite.body.x, this.sprite.body.y, path[this.i], path[this.j]);
                    // console.log("S", this.sprite.body.x, this.sprite.body.y);

                    // NEED TO FIX
                    // facing
                    if (this.sprite.body.speed != 0) {
                        this.facing = Math.floor(Phaser.Math.Angle.Normalize(-this.sprite.body.angle + Math.PI/2) * (180/Math.PI) / 45);                    
                        // console.log("facing", this.facing);
                    }        
                    this.sprite.play({
                        key: this.tags[(this.sprite.body.speed != 0 ? (this.facing * 2) + 1 : (this.facing * 2))].key,
                        repeat: -1,
                        timeScale: 0.5,
                    }, true)

                    // check if done with path
                    if (this.withinRange(this.sprite.body.x, this.sprite.body.y, path[this.i], path[this.j])) {
                        this.i += 2;
                        this.j += 2;

                        // if last point
                        if (this.i == path.length) {
                            if (gotoStart) { // do path again
                                this.i = 0;
                                this.j = 1;
                            }
                            else if (jumpttoStart) {
                                this.i = 0;
                                this.j = 1;
                                this.sprite.body.x = path[this.i];
                                this.sprite.body.y = path[this.j];
                            }
                            else { // stop
                                this.keepPathing = false;
                                // face 0
                                this.sprite.play({
                                    key: this.tags[0].key,
                                    repeat: -1,
                                    timeScale: 0.5,
                                }, true)

                                // do elseif for above, then else this
                                
                                // testing destroy, implement with flag
                                // console.log("Destroy");
                                // this.sprite.destroy();
                                // this.keepPathing = false;                                
                            }
                        }
                    }
                }
            }
            else { // pause
                this.sprite.body.setVelocityX(0);
                this.sprite.body.setVelocityY(0);
                this.sprite.play({
                    key: this.tags[0].key,
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

    withinRange(sheepX, sheepY, x, y) {
        // console.log("sx,sy,x,y: ", sheepX, sheepY, x, y);
        let x_dst = Math.abs(sheepX - x);
        let y_dst = Math.abs(sheepY - y);
        // console.log("x_dst: ", x_dst, "y_dst ", y_dst);

        // stop twiching between anims for facing
        if (x_dst < 2) {
            this.sprite.body.setVelocityX(0);
        }
        if (y_dst < 2) {
            this.sprite.body.setVelocityY(0);
        }

        if (x_dst < 2 && y_dst < 2) {
            console.log("withinRange");
            this.sprite.body.setVelocityX(0);
            this.sprite.body.setVelocityY(0);
            return true;
        }
        return false;
    }

    // can add alreadySet flags
    gotoPoint(sheepX, sheepY, pointX, pointY) {
        if (sheepX < pointX) {
            this.sprite.body.setVelocityX(40);
        }
        else if (sheepX > pointX) {
            this.sprite.body.setVelocityX(-40);
        }
        

        if (sheepY < pointY) {
            this.sprite.body.setVelocityY(35);
        }
        else if (sheepY > pointY) {
            this.sprite.body.setVelocityY(-35);
        }
    }


    doFace(angle) {
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