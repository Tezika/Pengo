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
}