class Street1 extends Phaser.Scene {
    constructor() {
        super('street1');
    }

    preload () {        
        this.load.image("tileset", "./assets/city_tiles.png");                    // tileset  
        this.load.tilemapTiledJSON("street1_map", "./assets/street1.json");       // street1 map               
        this.load.aseprite('sheep', './assets/sheep.png', './assets/sheep.json'); // sheep aseprite
    }
    

    create () {
        // sheep tags and camera
        this.sheep_tags = this.anims.createFromAseprite('sheep');
        this.cameras.main.setBackgroundColor('FFFFFF');

        // keys
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        
        // map and tileset
        const map = this.add.tilemap("street1_map");
        const tileSet = map.addTilesetImage("tiles", "tileset");
        // load layers
        const fg_Layer = map.createLayer("fg", tileSet, 0, 0);                // fg
        const buildings_Layer = map.createLayer("buildings", tileSet, 0, 0);  // buildings
        const ground_1_Layer = map.createLayer("ground_1", tileSet, 0, 0);    // ground_1
        const ground_2_Layer = map.createLayer("ground_2", tileSet, 0, 0);    // ground_2
        const bg_far_Layer = map.createLayer("bg_far", tileSet, 0, 0);        // bg_far
        // load objects       
        const p1Spawn = map.findObject("sheep", obj => obj.name === "p1spawn");        // player spawn point
        const s1Spawn = map.findObject("sheep", obj => obj.name === "s1spawn");        // sheep spawn point
        const s2Spawn = map.findObject("sheep", obj => obj.name === "s2spawn");        // sheep spawn point
        const s3Spawn = map.findObject("sheep", obj => obj.name === "s3spawn");        // sheep spawn point
        const nextScene = map.createFromObjects("transition", { name: "nextScene" });  // nextscene object
        this.physics.world.enable(nextScene, Phaser.Physics.Arcade.STATIC_BODY);

        // pathing
        this.path = [];
        const obj = map.getObjectLayer('path');
        obj.objects.forEach(
            (object) => {
                if (object.type === 'path') {
                    // console.log("x", object.x, "y", object.y);
                    this.path.push(object.x);
                    this.path.push(object.y);
                }                
            }
        )        
        // console.log(this.path);
               
        // collision
        buildings_Layer.setCollisionByProperty({ collides: true });        
        
        // world bounds
        this.physics.world.bounds.setTo(0, 0, map.widthInPixels, map.heightInPixels);

        // spawn player and sheep
        this.p1 = new Player(this, this.sheep_tags, p1Spawn.x, p1Spawn.y);
        this.s1 = new Sheep(this, this.sheep_tags, s1Spawn.x, s1Spawn.y, 6);
        this.s2 = new Sheep(this, this.sheep_tags, s2Spawn.x, s2Spawn.y, 12);
        this.s3 = new Sheep(this, this.sheep_tags, s3Spawn.x, s3Spawn.y, 12);

        // collider        
        this.physics.add.collider(this.p1.sprite, buildings_Layer);                 
        this.physics.add.collider(this.s1.sprite, this.s2.sprite); //, () => this.s1.sprite.x += 1);// 
        this.physics.add.collider(this.s1.sprite, this.s3.sprite); //, () => this.s1.sprite.x += 1);// 
        this.physics.add.collider(this.s2.sprite, this.s1.sprite); //, () => this.s2.sprite.x += 1);// 
        this.physics.add.collider(this.s2.sprite, this.s3.sprite); //, () => this.s2.sprite.x += 1);//  
        this.physics.add.collider(this.s3.sprite, this.s1.sprite); //, () => this.s3.sprite.x += 1);// 
        this.physics.add.collider(this.s3.sprite, this.s2.sprite); //, () => this.s3.sprite.x += 1);//         
        this.physics.add.overlap(this.p1.sprite, nextScene, ()=> this.scene.start("ending"));
        this.physics.add.collider(this.p1.sprite, this.s1.sprite);
        this.physics.add.collider(this.p1.sprite, this.s2.sprite);
        this.physics.add.collider(this.p1.sprite, this.s3.sprite);        

        this.s1.sprite.body.setBounce(1);
        this.s2.sprite.body.setBounce(1);
        this.s3.sprite.body.setBounce(1);
     
    }

    update () {
        this.p1.update(); // update player
        
        let pause = false;        // pause pathing
        let startFacing = false;  // start facing player (can do while pathing)
        let gotoStart = true;     // do path again (must be F if below T)
        let jumpttoStart = false; // teleport to start and path again (should be, but technically doesnt need to be F if above is T)
        // pause and start facing if player x exceeds 150
        if (this.p1.sprite.body.x > 150) {
            pause = true;
            startFacing = true;
        }
        else {
            pause = false; 
            startFacing = false;
        }
        // sheep update(moving, gotoStart, jumpttoStart, pause, path[], startFacing, player.x, player.y)
        this.s2.update(true, gotoStart, jumpttoStart, pause, this.path, startFacing, this.p1.sprite.x, this.p1.sprite.y);
        this.s3.update(true, gotoStart, jumpttoStart, pause, this.path, startFacing, this.p1.sprite.x, this.p1.sprite.y);
        this.s1.update(true, gotoStart, jumpttoStart, pause, this.path, startFacing, this.p1.sprite.x, this.p1.sprite.y);        

    }
}
