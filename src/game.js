import 'phaser'
import  Player from './player.js'
import  BlockManager from './blockmanager.js'

export default class GameScene extends Phaser.Scene
{
    constructor()
    {
        super();
    }

    preload()
    {
        //load the tiles
        this.load.tilemapTiledJSON('map', 'assets/tilemap/test.json');
        this.load.image('tiles','assets/tilemap/snowWIP.png');
        this.load.image('player','assets/player.jpg');
        this.titlesetName = 'snowWIP';

        this.blockManager = new BlockManager(this);
    }

    create()
    {
        this.map = this.make.tilemap({ key: 'map' });
        // The first parameter is the name of the tileset in Tiled and the second parameter is the key
        // of the tileset image used when loading the file in preload.
        var tiles = this.map.addTilesetImage(this.titlesetName, 'tiles');

        // You can load a layer from the map using the layer name from Tiled, or by using the layer
        // index (0 in this case).
        this.backgroundLayer = this.map.createDynamicLayer('background', tiles);
        this.backgroundLayer.setCollision([18, 38, 4,68]);
 
        this.player = new Player(this, 0, 0);
        this.player.sprite.x = this.map.tileToWorldX(1)+16;
        this.player.sprite.y= this.map.tileToWorldY(1)+16;
        this.player.cursors = this.input.keyboard.createCursorKeys();


        //Blocks' setup 
        this.blockManager.create();
    }

    update(time, delta)
    {
        this.player.updateMovement(time);
    }

    isTileOpenAt (worldX, worldY)
    {
        //nonNull = true, don't return null for empty tiles. This means null will be returned only for
        //tiles outside of the bounds of the map.
        var tile = this.map.getTileAtWorldXY(worldX, worldY, true);
        if (tile && !tile.collides)
        {
            return true;
        }
        else
        {
            return false;
        }
    }  

    updateMap()
    {

    }

    callback()
    {
        console.log("call back from the game");
    }
}