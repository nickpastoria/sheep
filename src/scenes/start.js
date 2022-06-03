
function loadPlayerCharacter(scene) {
    scene.load.aseprite('sheep', './assets/sheep.png', './assets/sheep.json'); // sheep aseprite
}

function loadTileMap(scene, scene_name) {
    scene.load.tilemapTiledJSON(`${scene_name}_map`, `./assets/Maps/${scene_name}.json`);       // Level tile map  
}

function topDownCreate(scene, scene_name, next_scene, tiles_name) {
            // sheep tags and camera
            scene.sheep_tags = scene.anims.createFromAseprite('sheep');
            scene.cameras.main.setBackgroundColor('FFFFFF');
    
            // keys
            keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
            keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
            keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
            keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
            
            // map and tileset
            const map = scene.add.tilemap(`${scene_name}_map`);
            console.log(`Loading tileset named ${tiles_name}`);
            const tileSet = map.addTilesetImage(tiles_name, tiles_name);
            // load layers
            const bg_far_Layer = map.createLayer("bg_far", tileSet, 0, 0);        // bg_far
            const ground_2_Layer = map.createLayer("ground_2", tileSet, 0, 0);    // ground_2
            const ground_1_Layer = map.createLayer("ground_1", tileSet, 0, 0);    // ground_1
            const buildings_Layer = map.createLayer("buildings", tileSet, 0, 0);  // buildings
            const fg_Layer = map.createLayer("fg", tileSet, 0, 0);                // fg
    
            // load objects       
            const p1Spawn = map.findObject("sheep", obj => obj.name === "p1spawn");        // player spawn point
    
            // Load transition boundaries
            scene.transitionsBoundaries = [];
            for ( let i = 0; i < scene.next_scene.length; i++){
                scene.transitionsBoundaries.push(map.createFromObjects("transition", { name: `d${i+1}` }));
                scene.physics.world.enable(scene.transitionsBoundaries[i], Phaser.Physics.Arcade.STATIC_BODY);
            }
                   
            // collision
            buildings_Layer.setCollisionByProperty({ collides: true });        
            
            // world bounds
            scene.physics.world.bounds.setTo(0, 0, map.widthInPixels, map.heightInPixels);
    
            // spawn player and sheep
            scene.p1 = new Player(scene, scene.sheep_tags, p1Spawn.x, p1Spawn.y);
    
            // collider        
            scene.physics.add.collider(scene.p1.sprite, buildings_Layer); 
            for ( let i = 0; i < scene.transitionsBoundaries.length; i++) {
                scene.physics.add.overlap(scene.p1.sprite, scene.transitionsBoundaries[i], ()=> scene.scene.start(scene.next_scene[i])); // Scene Transition
            }
}

class tdTemplate extends Phaser.Scene {
    
    constructor(scene_name, next_scene, tiles_name = "tiles") {
        super(scene_name);
        this.scene_name = scene_name;
        this.next_scene = next_scene;
        this.tiles_name = tiles_name;
    }

    preload () {        
        // loadCityTiles(this);          
        this.load.image("tiles", "./assets/Images/city_tiles.png");
        this.load.image("room_tiles", "./assets/Images/room_tiles.png");          // tileset  
        loadTileMap(this, this.scene_name);           
        loadPlayerCharacter(this);
    }

    create () {
        topDownCreate(this, this.scene_name, this.next_scene, this.tiles_name);
        console.log(`Now in: ${this.scene_name}`);
    }

    update () {
        this.p1.update();
    }
}
class Menu extends Phaser.Scene {
    constructor() {
        super('menu');
    }
    
    preload() {
        this.load.image(`start`, `./assets/Menu_Assets/Start.png`);
        this.load.image(`controls`, `./assets/Menu_Assets/Controls.png`);
        this.load.image(`title1`, `./assets/Menu_Assets/Title1.png`);
        this.load.image(`title2`, `./assets/Menu_Assets/Title2.png`);
    }

    create() {
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.cameras.main.setBackgroundColor(0xffffff);
        console.log('Now in: menu');
        this.start = this.add.sprite(182, 195, `start`).setOrigin(0, 0);
        this.anims.create({
            key: 'title_anim',
            frames: [
                {key: 'title1', duration: 500},
                {key: 'title2', duration: 500}
            ],
            frameRate: 8,
            repeat: -1
        });
        this.add.sprite(52+179,44+61, `title1`).play('title_anim').setOrigin(1,1);
        this.add.sprite(75, 195 + 10, `controls`).setOrigin(0.5, 0.5);
    }
    update(time) {
        let sinTime = Math.sin(time / 200);
        if(sinTime > 0) {
            this.start.setVisible(true);
        }
        if(sinTime < 0) {
            this.start.setVisible(false);
        }
        if(Phaser.Input.Keyboard.JustDown(keyA) || Phaser.Input.Keyboard.JustDown(keyD) || Phaser.Input.Keyboard.JustDown(keyW) || Phaser.Input.Keyboard.JustDown(keyS)) { 
            console.log(`Pressed Key`);
            this.scene.start(`start`);
        }
    }
}

class Start extends tdTemplate {
    constructor() {
        super(`start`, [`street`], "room_tiles");
    }
}

class Street extends tdTemplate {
    constructor() {
        super(`street`, [`college`]);
    }
}

class College extends tdTemplate {
    constructor() {
        super(`college`, [`boxing`]);
    }
}

class Final extends tdTemplate {
    constructor() {
        super(`final`, [`ending`]);
    }   
}