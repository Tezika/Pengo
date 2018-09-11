import 'phaser'
import  Player from './player.js'
import  BlockManager from './blockmanager.js'
import Enemy from './enemy.js';
import EnemyManager from './enemymanager.js';

export default class GameScene extends Phaser.Scene
{
    constructor()
    {
        super();
    }

    preload()
    {
        //load the tiles
        this.load.tilemapTiledJSON('map', 'assets/tilemap/test3.json');
        this.load.image('tiles','assets/tilemap/snowWIP.png');
        this.load.image('player','assets/player.jpg');
        this.load.image('block','assets/block.png');
        this.load.image('pengs', 'assets/pengs.png');
        this.titlesetName = 'snowWIP';

        this.blockManager = new BlockManager(this);
        this.enemyManager = new EnemyManager(this);
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
        this.backgroundLayer.setCollision([3, 38, 33,68]);

        this.tileWidth = this.map.tileWidth * this.backgroundLayer.scaleX;
        this.tileHeight = this.map.tileHeight * this.backgroundLayer.scaleY;
 
        //create the player
        this.player = new Player(this, 1, 1);

        //Blocks' setup 
        this.blockManager.create();
        //Enemy's setup
        this.enemyManager.create();
        this.enemyManager.add(4, 2);
        this.enemyManager.add(3, 2);
        this.enemyManager.add(6, 2);
        this.enemyManager.add(7, 2);
        this.enemyManager.add(3, 8);
        this.enemyManager.add(10, 3);
    }

    update(time, delta)
    {
        this.player.update(time);
        this.blockManager.update(time);
        this.enemyManager.update(time);
    }

    isTileOpenAt (worldX, worldY)
    {
        //nonNull = true, don't return null for empty tiles. This means null will be returned only for
        //tiles outside of the bounds of the map.
        var tile = this.map.getTileAtWorldXY(worldX, worldY, true);
        if (tile && !tile.collides)
        {
            var open = true;
            this.blockManager.blocks.forEach(block => {
                var blockTile = this.map.getTileAtWorldXY(block.sprite.x, block.sprite.y);
                if(blockTile == tile)
                {
                    open = false;
                }
            });

            return open;
        }
        else
        {
            return false;
        }
    } 

    isEnemyAt(worldX, worldY)
    {
        var tile = this.map.getTileAtWorldXY(worldX, worldY, true);
        if(tile && !tile.collides)
        {
            var isEnemyHere = false;
            this.enemyManager.enemies.forEach(enemy => {
                var enemyTile = this.map.getTileAtWorldXY(enemy.sprite.x, enemy.sprite.y);
                if(enemyTile == tile)
                {
                    isEnemyHere = true;
                }
            });
            return isEnemyHere;
        } 
        else
        {
            return false;
        }
    }
}