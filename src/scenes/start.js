
function loadPlayerCharacter(scene) {
    scene.load.aseprite('sheep', './assets/sheep.png', './assets/sheep.json'); // sheep aseprite
}

function loadTileMap(scene, scene_name) {
    scene.load.tilemapTiledJSON(`${scene_name}_map`, `./assets/maps/${scene_name}.json`);       // Level tile map  
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
        this.load.image("tiles", "./assets/images/city_tiles.png");
        this.load.image("room_tiles", "./assets/images/room_tiles.png");          // tileset  
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
        super(`college`, [`college_money`]);
    }
}

class College_Money extends tdTemplate {
    constructor() {
        super(`college_money`, [`business_class`]);
    }
}

class Business_Class extends tdTemplate {
    constructor() {
        super(`business_class`, [`frat_party`]);
    }
}

class Frat_Party extends tdTemplate {
    constructor() {
        super(`frat_party`, [`app`]);
    }
}

class App extends tdTemplate {
    constructor() {
        super(`app`, [`space`]);
    }
}

class Space extends tdTemplate {
    constructor() {
        super(`space`, [`iss_ending`]);
    }
}

class ISS_Ending extends tdTemplate {
    constructor() {
        super(`iss_ending`, [`start`]);
    }
}