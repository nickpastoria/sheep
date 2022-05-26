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
        const d1 = map.createFromObjects("transition", { name: "d1" });  // transition object
        this.physics.world.enable(d1, Phaser.Physics.Arcade.STATIC_BODY);

        // pathing
        // this.path = [];
        // const obj = map.getObjectLayer('path');
        // obj.objects.forEach(
        //     (object) => {
        //         if (object.type === 'path') {
        //             console.log("x", object.x, "y", object.y);
        //             this.path.push(object.x);
        //             this.path.push(object.y);
        //         }                
        //     }
        // )        
        // console.log(this.path);
               
        // collision
        buildings_Layer.setCollisionByProperty({ collides: true });        
        
        // world bounds
        this.physics.world.bounds.setTo(0, 0, map.widthInPixels, map.heightInPixels);

        // spawn player and sheep
        this.p1 = new Player(this, this.sheep_tags, p1Spawn.x, p1Spawn.y);

        // collider        
        this.physics.add.collider(this.p1.sprite, buildings_Layer); 
        this.physics.add.overlap(this.p1.sprite, d1, ()=> this.scene.start("ending")); // Scene Transition

    }

    update () {
        this.p1.update();
        // sheep update(moving, path[], startFacing, x, y)
        this.s1.update(true, this.path, false, this.p1.sprite.x, this.p1.sprite.y);
        // this.s2.update(true, this.path, false, this.p1.sprite.x, this.p1.sprite.y);
    }
}