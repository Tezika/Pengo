import 'phaser'
import Enemy from './enemy';
import { Constant } from './game';

export default class EnemyManager {
    constructor(scene) {
        this.scene = scene;
        this.preload();
    }

    preload() {

    }

    create() {
        this.enemies = [];

        if(!this.scene.anims.get('enemyDown'))
        this.scene.anims.create({
            key: 'enemyDown',
            frames: this.scene.anims.generateFrameNumbers('enemyFront', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        if(!this.scene.anims.get('enemySide'))
        this.scene.anims.create({
            key: 'enemySide',
            frames: this.scene.anims.generateFrameNumbers('enemySide', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        if(!this.scene.anims.get('enemyUp'))
        this.scene.anims.create({
            key: 'enemyUp',
            frames: this.scene.anims.generateFrameNumbers('enemyBack', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        if(!this.scene.anims.get('enemyStun'))
        this.scene.anims.create({
            key: 'enemyStun',
            frames: this.scene.anims.generateFrameNumbers('enemyStun', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        if(!this.scene.anims.get('enemyDeath'))
        this.scene.anims.create({
            key: 'enemyDeath',
            frames: this.scene.anims.generateFrameNumbers('enemyDeath', { start: 0, end: 2 }),
            frameRate: 10
        });

        this.scene.map.forEachTile(tile => {
            if (tile.properties.enemy) {
                tile.index = Constant.Empty_Tile_Index;
                this.enemies.push(new Enemy(this.scene, tile.x, tile.y));
            }
        }); 
        this.enemies[0].destroying = true;
        this.hsv = Phaser.Display.Color.HSVColorWheel();
        this.enemies[0].sprite.tint = this.hsv[300].color;

        this.enemySpawner = this.scene.time.addEvent({
            delay: 4000,
            callback: this.spawnEnemy.bind(this),
            loop: true
        })

        this.purpleSpawnRate = .8;
    }

    add(tileX, tileY) {
        var newEnemy = new Enemy(this.scene, tileX, tileY);
        this.enemies.push(newEnemy);
    }

    update(time) {
        this.enemies.forEach(enemy => {
            enemy.update(time);
            this.scene.physics.world.overlap(enemy.sprite, this.scene.player.sprite, this.overlapCallback.bind(this));
        });
    }

    remove(enemy) {
        const index = this.enemies.indexOf(enemy);
        this.enemies.splice(index, 1);
    }

    getEnemyByTile(tile) {
        //Maybe I'll change the origin later, remember to change that;
        var spriteX = this.scene.map.tileToWorldX(tile.x) + Constant.Tile_Size / 2;
        var sprtieY = this.scene.map.tileToWorldY(tile.y) + Constant.Tile_Size / 2;
        var foundEnemy = null;
        this.enemies.forEach(enemy => {
            //Fix, but this is just a test factor.
            if (Math.abs(enemy.sprite.x - spriteX) <= Constant.Tile_Size / 2 && Math.abs(enemy.sprite.y - sprtieY) <= Constant.Tile_Size / 2) {
                foundEnemy = enemy;
            }
        });
        return foundEnemy;
    }

    overlapCallback(obj1, obj2) {
        if (this.scene.player != null) {
            this.enemies.forEach(enemy => {
                if (enemy.sprite.x == obj1.x && enemy.sprite.y == obj1.y) {
                    this.scene.player.die();
                }
            });
        }
    }

    spawnEnemy()
    {
        if(this.enemies.length < Constant.Enemy_Count_OneScreen && !this.scene.blockManager.specialActivated)
        {
            var rnd = Math.random();
            if(rnd > .67)
            {
                this.enemies.push(new Enemy(this.scene, 2, 11));
            }else if(rnd > .33)
            {
                this.enemies.push(new Enemy(this.scene, 22, 11));
            }else
            {
                this.enemies.push(new Enemy(this.scene, 22, 2));
            }
        }
    }
}