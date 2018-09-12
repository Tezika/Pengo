import 'phaser'
import Enemy from './enemy';

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
                tile.index = 1;
                this.enemies.push(new Enemy(this.scene, tile.x, tile.y));
            }
        });
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
        });
    }

    remove(enemy) {
        const index = this.enemies.indexOf(enemy);
        this.enemies.splice(index, 1);
    }

    getEnemyByTile(tile)
    {
        //maybe change the origin later
        var spriteX = this.scene.map.tileToWorldX(tile.x) + 16;
        var sprtieY = this.scene.map.tileToWorldY(tile.y) + 16;
        var foundEnemy = null;
        this.enemies.forEach(enemy => {
            //This is just a test factor.
           if(Math.abs(enemy.sprite.x - spriteX) <= 2.5 * enemy.moveSpeed && Math.abs(enemy.sprite.y - sprtieY) <= 2.5 *enemy.moveSpeed)
           {
                foundEnemy = enemy;
           } 
        });
        return foundEnemy;
    }

    getEnemyAt(worldX, worldY)
    {
        worldX+=32;
        var enemy;
        for(var i = 0; i < this.enemies.length; i++)
        {
            if(this.enemies[i].sprite.x >= worldX-10 && this.enemies[i].sprite.x <= worldX+10 && 
                this.enemies[i].sprite.y >= worldY-10 && this.enemies[i].sprite.y <= worldY+10 )
            {
                enemy = this.enemies[i];
            }
        }
        return enemy;
    }
}