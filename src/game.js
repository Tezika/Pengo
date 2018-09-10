import 'phaser'
import  Player from './player.js'

export default class GameScene extends Phaser.Scene
{
    constructor()
    {
        super();
    }

    preload()
    {
        //load the tile
        this.load.tilemapTiledJSON('map', 'assets/tilemap/test.json');
        this.load.image('tiles','assets/tilemap/snowWIP.png');
        this.load.image('player','assets/player.png');
        this.titlesetName = 'snowWIP';
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

        this.backgroundLayer.setCollision([2, 4, 33,117]);
 
        this.player = new Player(this, 0, 0);
        this.player.sprite.x = this.map.tileToWorldX(1)+16;
        this.player.sprite.y= this.map.tileToWorldY(1)+16;

        // this.physics.add.collider(player, backgroundLayer);

        //  //  Here we create our coins group
        //  blocks = game.add.group();
        //  blocks.enableBody = true;
 
        //  //  And now we convert all of the Tiled objects with an ID of 34 into sprites within the coins group
        //  map.createFromObjects('blocks', 116, null, null);
    
        this.player.cursors = this.input.keyboard.createCursorKeys();
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
}