// For the base top-down gameplay scene
class Topdown extends Phaser.Scene {
    constructor() {
        super('topdown');
    }

    preload () {
        // this.load.image("tiles", "assets/cloud_tileset.png");
        this.load.image("tileset", "./assets/tiles.png");
        // this.load.tilemapTiledJSON("city_map", "assets/city_map.json");
        this.load.tilemapTiledJSON("city_map", "./assets/myCity.json");
        // this.load.image("shark", "assets/shark.png");        
        this.load.aseprite('sheep', './assets/sheep.png', './assets/sheep.json');
        this.sheep_tags = this.anims.createFromAseprite('sheep');

    }
    
    create() {       

        this.cameras.main.setBackgroundColor('FFFFFF');

        // keys
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        
        const map = this.add.tilemap("city_map");
        const tileSet = map.addTilesetImage("tiles", "tileset");
        const groundLayer = map.createLayer("Ground", tileSet, 0, 0);
        // const cloudsLayer = map.createLayer("Clouds", tileSet, 0, 0);
        const buildingsLayer = map.createLayer("Buildings", tileSet, 0, 0);        
        const objectsLayer = map.createLayer("Objects", tileSet, 0, 0);                
        
        // cloudsLayer.setCollisionByProperty({ 
        //     collides: true 
        // });
        buildingsLayer.setCollisionByProperty({ 
            collides: true 
        });
        objectsLayer.setCollisionByProperty({ 
            collides: true 
        });
        
        // this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        // this.cameras.main.startFollow(this.p1, true, 0.25, 0.25);

        this.p1 = new Player(this, this.sheep_tags);

        // world bounds
        this.physics.world.bounds.setTo(0, 0, map.widthInPixels, map.heightInPixels);

        // collider        
        // this.physics.add.collider(this.p1.sprite, cloudsLayer);
        this.physics.add.collider(this.p1.sprite, buildingsLayer, this.touchinBuilding);
    
        
        this.physics.add.collider(this.p1.sprite, buildingsLayer);        
        // this.physics.add.collider(this.p1.sprite, objectsLayer);        
    }

        update() {
            this.p1.update();    
        }

        touchinBuilding () {
            console.log("Touching Clouds");
        }
    
}