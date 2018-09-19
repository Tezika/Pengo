import 'phaser'
import GameScene from './game.js';

export const Constant = 
{
    Tile_Size: 64,
    Empty_Tile_Index: 132,
    Player_Lifes: 3
}

export default class GameScene2 extends GameScene
{
    constructor()
    {
        super();
        Phaser.Scene.call(this, { key: 'level2' });
        this.loadLevel = function()
        {
            this.map = this.make.tilemap({ key: 'map2' });
        }
    }

    create()
    {
        super.create();
        this.enemyManager.purpleSpawnRate = .05;
    }
}