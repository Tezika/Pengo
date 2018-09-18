import 'phaser'
import  Player from './player.js'
import  BlockManager from './blockmanager.js'
import EnemyManager from './enemymanager.js';
import WallManager from './wallmanager.js';
import SlimeManager from './slimemanager.js';
import ScoreManager from './scoremanager.js';
import UIManager from './uimanager.js';
import PortalManager from './portalmanager.js';

export const Constant = 
{
    Tile_Size: 64,
    Empty_Tile_Index: 132,
    Player_Lifes: 3
}

export default class GameScene extends Phaser.Scene
{
    constructor()
    {
        super();
        Phaser.Scene.call(this, { key: 'game' });
    }

    preload()
    {
        
        //load the tiles
        this.load.tilemapTiledJSON('map', 'assets/tilemap/pengo.json');
        this.load.image('tiles','assets/tilemap/snowWIP.png');
        this.load.image('cage', 'assets/Cage.png');
        this.titlesetName = 'snowWIP';

        // Wall assets
        this.load.image('Skull','assets/Skull.png');
        this.load.image('Skull Penguin','assets/Skullpenguin.png');
        this.load.image('fire','assets/fireEye.png');
        this.load.image('tar','assets/tar.png');
        this.load.image('livesBg', 'assets/livesBG.jpg');
        this.load.spritesheet('enemyCage','assets/enemyCage.png', {frameWidth: 64, frameHeight: 64});
        this.load.spritesheet('torch','assets/torch.png', {frameWidth: 64, frameHeight: 64});
        this.load.spritesheet('blockDestroy','assets/blockDestroy.png', {frameWidth: 64, frameHeight: 64});
        this.load.image('background', 'assets/background_final.png');
        this.load.image('portal', 'assets/Portal.png');
        this.load.image('portalGrey', 'assets/Portal_Inactive.png');
      
        // Player animations
        this.load.spritesheet('sidePlayer','assets/sidePlayer.png', {frameWidth: 64, frameHeight: 64});
        this.load.spritesheet('downPlayer','assets/downPlayer.png', {frameWidth: 64, frameHeight: 64});
        this.load.spritesheet('upPlayer','assets/upPlayer.png', {frameWidth: 64, frameHeight: 64});
        this.load.spritesheet('deathPlayer','assets/deathPlayer.png', {frameWidth: 64, frameHeight: 64});

        this.load.spritesheet('wisp', 'assets/wisp.png', {frameWidth: 64, frameHeight: 64});

        //Enemy animation stuff
        this.load.spritesheet('enemyFront','assets/enemyFront.png', {frameWidth: 64, frameHeight: 64});
        this.load.spritesheet('enemySide','assets/enemySide.png', {frameWidth: 64, frameHeight: 64});
        this.load.spritesheet('enemyBack','assets/enemyBack.png', {frameWidth: 64, frameHeight: 64});
        this.load.spritesheet('enemyStun','assets/enemyStun.png', {frameWidth: 64, frameHeight: 64});
        this.load.spritesheet('enemyDeath','assets/enemyDeath.png', {frameWidth: 64, frameHeight: 64});

        //Font assets
        this.load.bitmapFont('upheaval', 'assets/fonts/upheaval.png', 'assets/fonts/upheaval.fnt');

        this.blockManager = new BlockManager(this);
        this.enemyManager = new EnemyManager(this);
        this.wallManager = new WallManager(this);
        this.slimeManager = new SlimeManager(this);
        this.scoreManager = new ScoreManager(this);
        this.portalManager = new PortalManager(this);
        this.uiManager = new UIManager(this, 800, 32);
    }

    create()
    {
        this.bg = this.add.tileSprite(800, 448, 1600, 896,'background');

        this.map = this.make.tilemap({ key: 'map' });
        // The first parameter is the name of the tileset in Tiled and the second parameter is the key
        // of the tileset image used when loading the file in preload.
        var tiles = this.map.addTilesetImage(this.titlesetName, 'tiles');

        // You can load a layer from the map using the layer name from Tiled, or by using the layer
        // index (0 in this case).
        this.backgroundLayer = this.map.createStaticLayer('background', tiles);

        this.tileWidth = this.map.tileWidth * this.backgroundLayer.scaleX;
        this.tileHeight = this.map.tileHeight * this.backgroundLayer.scaleY;
 
        //create the player
        this.player = new Player(this, 2, 2);

        //Blocks' setup 
        this.blockManager.create();

        //Enemy's setup
        this.enemyManager.create();

        //Wall setup
        this.wallManager.create();

        //Slime setup
        this.slimeManager.create();
        
        //UI setup
        this.uiManager.create();

        //Portal setup
        this.portalManager.create();

        this.backgroundLayer.setCollision([154]);
    }

    update(time, delta)
    {
        this.player.update(time);
        this.blockManager.update(time);
        this.wallManager.update(time);
        this.enemyManager.update(time);
        this.slimeManager.update(time);
        this.portalManager.update(time);
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

    getObjAt (worldX, worldY)
    {
        for(var i = 0; i < this.blockManager.blocks.length; i++)
        {
            if(worldX == this.blockManager.blocks[i].sprite.x && worldY == this.blockManager.blocks[i].sprite.y)
            {
                return this.blockManager.blocks[i];
            }
        }

        for(var i = 0; i < this.wallManager.wallSprites.length; i++)
        {
            if(worldX == this.wallManager.wallSprites[i].x && worldY == this.wallManager.wallSprites[i].y)
            {
                return this.wallManager.wallSprites[i];
            }
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