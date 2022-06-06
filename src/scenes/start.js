
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
            this.map = scene.add.tilemap(`${scene_name}_map`);
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
                scene.physics.add.overlap(scene.p1.sprite, scene.transitionsBoundaries[i], ()=> {
                    scene.scene.start(scene.next_scene[i]) 
                    scene.sound.stopAll()}); // Scene Transition
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
        this.load.audio(`${this.scene_name}_narration`, `./assets/Audio/Narration/${this.scene_name}.ogg`);
        this.load.audio(`room_ambient`, `./assets/Audio/Ambient/Room Ambient.ogg`);
        this.load.audio(`low_drone_loop`, `./assets/Audio/Ambient/low_drone_loop.ogg`);
        this.load.audio(`street_ambience`, `./assets/Audio/Ambient/street ambience.ogg`);
        this.load.audio(`street_ambience-2`, `./assets/Audio/Ambient/street ambience-2.ogg`);
    }

    create () {
        if(this.scene_name != `start`){ 
            this.narration = this.sound.add(`${this.scene_name}_narration`);
            this.narration.play();
        }
        if(this.scene_name == `final`){
            this.narration.once('complete', ()=> {
                this.cameras.main.fadeOut(2000);
            });
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                this.scene.start(`ending`);
            })
        }
        topDownCreate(this, this.scene_name, this.next_scene, this.tiles_name);
        console.log(`Now in: ${this.scene_name}`);
        if(this.scene_name == `start`) {
            this.room_ambient = this.sound.add(`room_ambient`);
            this.room_ambient.setLoop(true);
            this.room_ambient.play();
        }
        if(this.scene_name == `hallway`) {
            this.room_ambient = this.sound.add(`low_drone_loop`);
            this.room_ambient.volume = 0;
            this.tweens.add({
                targets: this.room_ambient,
                volume: 1,
                duration: 500
            });
            this.room_ambient.setLoop(true);
            this.room_ambient.play();
            
            // get sheep spawn points
            this.sheep_points = []; 
            for (let i=0; i < 22; i++) {
                    this.sheep_points[i] = map.findObject("sheep", obj => obj.name === `s${i+1}spawn`);
            }

            // create sheep
            this.sheep = [];
            for (let i=0; i < 22; i++) {
                this.sheep[i] = new Sheep(this, this.sheep_tags, this.sheep_points[i].x, this.sheep_points[i].y, 6);
            }


            // get each path
            const obj = map.getObjectLayer('path');
            this.path1 = []; this.path2 = [];
            this.path3 = []; this.path4 = [];
            this.path5 = [];
            obj.objects.forEach(
                (object) => {
                    if (object.type === 'path1') {
                        this.path1.push(object.x);
                        this.path1.push(object.y);
                    }
                    else if (object.type === 'path2') {
                        this.path2.push(object.x);
                        this.path2.push(object.y);
                    }
                    else if (object.type === 'path3') {                        
                        this.path3.push(object.x);
                        this.path3.push(object.y);
                    }
                    else if (object.type === 'path4') {                        
                        this.path4.push(object.x);
                        this.path4.push(object.y);
                    }
                    else if (object.type === 'path5') {                        
                        this.path5.push(object.x);
                        this.path5.push(object.y);
                    }
                }
            )           
            
            // get pathing sheep spawn points
            const s1Spawn = map.findObject("sheep", obj => obj.name === "s100spawn");
            const s2Spawn = map.findObject("sheep", obj => obj.name === "s200spawn");
            const s3Spawn = map.findObject("sheep", obj => obj.name === "s300spawn");
            const s4Spawn = map.findObject("sheep", obj => obj.name === "s400spawn");
            const s5Spawn = map.findObject("sheep", obj => obj.name === "s500spawn");
            // create pathing sheep
            this.s1 = new Sheep(this, this.sheep_tags, s1Spawn.x, s1Spawn.y, 6);
            this.s2 = new Sheep(this, this.sheep_tags, s2Spawn.x, s2Spawn.y, 6);
            this.s3 = new Sheep(this, this.sheep_tags, s3Spawn.x, s3Spawn.y, 6);
            this.s4 = new Sheep(this, this.sheep_tags, s4Spawn.x, s4Spawn.y, 6);
            this.s5 = new Sheep(this, this.sheep_tags, s5Spawn.x, s5Spawn.y, 6);
        }
        if(this.scene_name == `street`) {
            this.room_ambient = this.sound.add(`street_ambience`);
            this.room_ambient.volume = 0;
            this.tweens.add({
                targets: this.room_ambient,
                volume: 1,
                duration: 500
            });
            this.room_ambient.setLoop(true);
            this.room_ambient.play();
        }
        if(this.scene_name == `college`) {
            this.room_ambient = this.sound.add(`street_ambience-2`);
            this.room_ambient.volume = 0;
            this.tweens.add({
                targets: this.room_ambient,
                volume: 1,
                duration: 500
            });
            this.room_ambient.setLoop(true);
            this.room_ambient.play();
        }
    }

    update () {
        if(this.scene_name != `final`) {
            this.p1.update();
        }
        if (this.scene_name == `hallway`) { 
            // update sheep
            for (let i=0; i < 22; i++) {
                //      sheep update(moving, gotoStart, jumpttoStart, pause, path[], startFacing, facingAtEnd, player.x, player.y)
                this.sheep[i].update(false, false, false, false, this.path, true, false, this.p1.sprite.x, this.p1.sprite.y);
            }            
            // update pathing sheep
            this.s1.update(true, false, false, false, this.path1, false, true, this.p1.sprite.x, this.p1.sprite.y);
            this.s2.update(true, false, false, false, this.path2, false, true, this.p1.sprite.x, this.p1.sprite.y);
            this.s3.update(true, false, false, false, this.path3, false, true, this.p1.sprite.x, this.p1.sprite.y);
            this.s4.update(true, false, false, false, this.path4, false, true, this.p1.sprite.x, this.p1.sprite.y);
            this.s5.update(true, false, false, false, this.path5, false, true, this.p1.sprite.x, this.p1.sprite.y);
        }
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
        this.load.audio(`gaming ambient`, `./assets/Audio/Ambient/gaming ambient.ogg`);
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

        this.room_ambient = this.sound.add(`gaming ambient`);
        this.room_ambient.setLoop(true);
        this.room_ambient.play();
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
            this.sound.stopAll();
            this.scene.start(`introCutscene`);
        }
    }
}

class IntroCutscene extends Phaser.Scene {
    constructor() {
        super('introCutscene');
    }
    preload() {
        this.load.audio(`start_narration`, `./assets/Audio/Narration/start-001.ogg`);
        this.load.audio(`start_music`, `./assets/Audio/Narration/start-002.ogg`);
        this.load.aseprite('cutscene', './assets/intro.png', './assets/intro.json');
    }
    create() {
        console.log('Now in: introCutscene');
        this.narration = this.sound.add(`start_narration`);
        this.music = this.sound.add(`start_music`);
        this.music.play();
        this.narration.play();
        this.narration.once(`complete`, () => {
            this.cameras.main.fadeOut(2000);
        });
        this.cameras.main.fadeIn(2000);
        this.cutscene = this.add.sprite(0, 0).setOrigin(0,0);
        this.cutsceneAnim = this.anims.createFromAseprite('cutscene');
        this.animation = this.cutscene.play({key: this.cutsceneAnim[0].key, repeat: -1, yoyo: true});
        this.animation.repeat = -1;
        
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.scene.start(`start`);
        });
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
        super(`college`, [`hallway`]);
    }
}

class Hallway extends tdTemplate {
    constructor() {
        super(`hallway`, [`boxing`]);
    }
}

class Final extends tdTemplate {
    constructor() {
        super(`final`, [`ending`], "room_tiles");
    }   
}

class Ending extends Phaser.Scene {
    constructor() {
        super('ending');
    }
    
    preload() {
        this.load.image("bg", "./assets/Ending/bg.png");
        this.load.image("endingBoxer", "./assets/Ending/boxer.png");
        this.load.image("glove", "./assets/Ending/glove.png");
        this.load.image("pbag", "./assets/Ending/pbag.png");
        this.load.image("Text", "./assets/Ending/Text.png");
        this.load.image("credits", "./assets/Ending/credits.png");
        this.load.audio(`ending`, `./assets/Audio/Narration/ending.ogg`);
        this.load.audio('ending_music', `./assets/Audio/Ambient/ending_music.ogg`);
    }

    create() {
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.cameras.main.setBackgroundColor(0xffffff);
        console.log('Now in: ending');
        this.bg = this.add.sprite(0, 0, `bg`).setOrigin(0, 0);
        this.boxer = this.add.sprite(0, 0, `endingBoxer`).setOrigin(0, 0);
        this.glove = this.add.sprite(0, 0, `glove`).setOrigin(0, 0);
        this.pbag = this.add.sprite(0, 0, `pbag`).setOrigin(0, 0);
        this.Text = this.add.sprite(0, 0, `Text`).setOrigin(0, 0);
        this.narration = this.sound.add(`ending`);
        this.narration.play();

        this.music = this.sound.add(`ending_music`);
        this.music.play();
        this.cameras.main.fadeIn(2000);

        this.time.addEvent({
            delay: 4000,
            callback: () => {
                this.cameras.main.fadeOut(4000);
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                    this.credits = this.add.sprite(0, 0, `credits`).setOrigin(0, 0);
                    this.cameras.main.fadeIn(4000);
                    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, (cam, effect) => {
                        this.time.addEvent({
                            delay: 4000,
                            callback: () => {
                                this.cameras.main.fadeOut(4000);
                                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                                    this.scene.start(`menu`);
                                });
                            }
                        })
                    });
                });
            }
        })

        this.tweens.add({
            targets: this.boxer,
            x: 10,
            duration: 2000,
            ease: 'sine',
            yoyo: true,
            repeat: -1
        });
        this.tweens.add({
            targets: this.pbag,
            x: -10,
            duration: 2000,
            ease: 'sine',
            yoyo: true,
            repeat: -1
        });
        this.tweens.add({
            targets: this.glove,
            x: -100,
            duration: 2000,
            ease: 'sine',
            yoyo: true,
            repeat: -1
        });
    }
    update(time) {
    }
}