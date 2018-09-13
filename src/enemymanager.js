import 'phaser'
import Enemy from './enemy';
import { Constant } from './game';

export default class EnemyManager
{
    constructor(scene)
    {
        this.scene = scene;
        this.preload();
    }
    
    preload()
    {
        
    }

    create()
    {
        this.enemies = [];

        this.scene.map.forEachTile(tile => {
            if(tile.properties.enemy)
            {
                tile.index = Constant.Empty_Tile_Index;
                this.enemies.push(new Enemy(this.scene, tile.x, tile.y));
            }
        });
        this.enemies[0].destroying = true;
        this.hsv = Phaser.Display.Color.HSVColorWheel();
        this.enemies[0].sprite.tint = this.hsv[300].color;
    }

    add(tileX, tileY)
    {
        var newEnemy = new Enemy(this.scene, tileX, tileY);
        this.enemies.push(newEnemy);
    }

    update(time)
    {
        this.enemies.forEach(enemy => {
            enemy.update(time);
            this.scene.physics.world.overlap(enemy.sprite, this.scene.player.sprite, this.overlapCallback.bind(this));
        });
    }

    remove(enemy) {
        const index = this.enemies.indexOf(enemy);
        this.enemies.splice(index, 1);
    }

    getEnemyByTile(tile)
    {
        //Maybe I'll change the origin later, remember to change that;
        var spriteX = this.scene.map.tileToWorldX(tile.x) + Constant.Tile_Size/2;
        var sprtieY = this.scene.map.tileToWorldY(tile.y) + Constant.Tile_Size/2;
        var foundEnemy = null;
        this.enemies.forEach(enemy => {
            //Fix, but this is just a test factor.
           if(Math.abs(enemy.sprite.x - spriteX) <= Constant.Tile_Size/2 && Math.abs(enemy.sprite.y - sprtieY) <=  Constant.Tile_Size/2)
           {
                foundEnemy = enemy;
           } 
        });
        return foundEnemy;
    }

    overlapCallback()
    {
        if(this.scene.player != null)
        {
            this.scene.player.die();
        }
    }
}