import 'phaser';
import './game.js'
import { Direction } from './block.js';
import { Constant } from './game.js';
import Block from './block';

export default class Player {
    constructor(scene, tileX, tileY) {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(0, 0, "player", 0);
        this.sprite.x = this.scene.map.tileToWorldX(tileX) + Constant.Tile_Size / 2;
        this.sprite.y = this.scene.map.tileToWorldY(tileY) + Constant.Tile_Size / 2;
        this.sprite.depth = 3;

        this.cursors = scene.input.keyboard.createCursorKeys();
        this.scene.physics.add.collider(this.sprite, this.backgroundLayer);
        this.lastMoveTime = 0;
        this.lastPushTime = 0;
        this.lastStunTime = 0;
        this.facing = Direction.Down;
        this.lives = Constant.Player_Lifes;
        this.tween = null;

        this.canMove = true;

        this.slimeTimer = 0;
        this.moveDelay = 200;
        this.slimeDuration = 2000;
        this.slimeActive = false;

        this.spaceBar = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.scene.anims.create({
            key: 'downPlayer',
            frames: this.scene.anims.generateFrameNumbers('downPlayer', { start: 0, end: 13 }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'sidePlayer',
            frames: this.scene.anims.generateFrameNumbers('sidePlayer', { start: 0, end: 12 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'upPlayer',
            frames: this.scene.anims.generateFrameNumbers('upPlayer', { start: 0, end: 12 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'deathPlayer',
            frames: this.scene.anims.generateFrameNumbers('deathPlayer', { start: 0, end: 13 }),
            frameRate: 10
        });

        this.sprite.anims.play('downPlayer', true);
        this.sprite.on('animationcomplete', this.deathComplete, this);
    }

    update(time) {
        this.push(time);
        this.updateMovement(time);
        this.slimeUpdate(time);
    }

    slimeUpdate(time) {
        if (this.slimeActive && this.slimeTimer == 0) {
            this.slimeTimer = time;
        }else if (time > this.slimeTimer + this.slimeDuration) {
            this.slimeActive = false;
            this.moveDelay = 200;
            this.slimeTimer = 0;
        }
    }

    slimed() {
        this.moveDelay = 600;
        this.slimeActive = true;
    }

    deathComplete(animation, frame)
    {
        if(animation.key == "deathPlayer")
        {   
            --this.lives;
            if( this.lives > 0)
            {
                this.scene.uiManager.updateLives();
                this.respawn();
            }
            else
            {
                //Jump into the final scene
                this.scene.scene.start('over');
            }
        }
    }

    die() {
        this.sprite.anims.play('deathPlayer', true);
        this.lastMoveTime = Number.MAX_SAFE_INTEGER;
    }

    respawn() {
        if (this.tween != null) {
            this.tween.stop();
        }
        this.sprite.x = this.scene.map.tileToWorldX(2) + Constant.Tile_Size / 2;
        this.sprite.y = this.scene.map.tileToWorldY(2) + Constant.Tile_Size / 2;
        this.sprite.anims.play('downPlayer', true);
        this.lastMoveTime = 0;
    }

    updateMovement(time) {
        var tw = 0;
        var th = 0;

        if (time > this.lastMoveTime + this.moveDelay && this.canMove) {
            if (this.cursors.down.isDown) {
                this.sprite.anims.play('downPlayer', true);
                this.facing = Direction.Down;
                this.sprite.flipX = false;
                th = this.scene.tileHeight;
            }
            else if (this.cursors.up.isDown) {
                this.sprite.anims.play('upPlayer', true);
                this.facing = Direction.Up;
                this.sprite.flipX = false;
                th = -this.scene.tileHeight;
            } else if (this.cursors.left.isDown) {
                this.sprite.anims.play('sidePlayer', true);
                this.sprite.flipX = false;
                this.facing = Direction.Left;
                tw = -this.scene.tileWidth;
            }
            else if (this.cursors.right.isDown) {
                this.sprite.anims.play('sidePlayer', true);
                this.facing = Direction.Right;
                this.sprite.flipX = true;
                tw = this.scene.tileWidth;
            }

            if (tw != 0 || th != 0) {
                if (this.scene.isTileOpenAt(this.sprite.x + tw, this.sprite.y + th)) {
                    this.lastMoveTime = time;
                    this.canMove = false;

                    this.tween = this.scene.tweens.add({
                        targets: this.sprite,
                        ease: 'Linear',
                        duration: this.moveDelay - 20,
                        x: this.sprite.x + tw,
                        y: this.sprite.y + th,
                        onComplete: this.onTweenComplete.bind(this),
                        onCompleteParams: [this.sprite]
                  });
                }
            }
        }
    }

    onTweenComplete(sprite) {
        this.canMove = true;

        //Clamp to grid
        sprite.x = Math.round((sprite.x-32) / 64) * 64 + 32;
        sprite.y = Math.round((sprite.y-32) / 64) * 64 + 32;
    }

    push(time) {
        var repeatPushDelay = 200;
        var repeatStunDelay = 1500;
        if (time > this.lastPushTime + repeatPushDelay) {
            var tw = this.scene.tileWidth;
            var th = this.scene.tileHeight;
            if (this.spaceBar.isDown) {
                var xmov = tw;
                var ymov = th;
                switch (this.facing) {
                    case Direction.Right: //right
                        ymov = 0;
                        break;
                    case Direction.Down: //down
                        xmov = 0;
                        break;
                    case Direction.Left: //left
                        xmov = -xmov;
                        ymov = 0;
                        break;
                    case Direction.Up: //up
                        xmov = 0;
                        ymov = -ymov;
                        break;
                    default:
                        break;
                }

                //Clamp to grid
                this.sprite.x = Math.round((this.sprite.x-32) / 64) * 64 + 32;
                this.sprite.y = Math.round((this.sprite.y-32) / 64) * 64 + 32;

                this.scene.blockManager.blocks.forEach(block => {
                    if (this.sprite.x + xmov == block.sprite.x && this.sprite.y + ymov == block.sprite.y) {
                        if (!this.scene.isTileOpenAt(block.sprite.x + xmov, block.sprite.y + ymov)) {
                            block.destroy();
                        }
                        else {
                            block.move(this.facing);
                        }
                    }
                });


                if (time > this.lastStunTime + repeatStunDelay) {
                    this.WallStunning(time, xmov, ymov);
                }

                this.lastPushTime = time;
            }
        }
    }

    WallStunning(time, xmov, ymov) {
        var lookSpr = this.scene.getObjAt(this.sprite.x + xmov, this.sprite.y + ymov);
        if (lookSpr instanceof Phaser.GameObjects.Sprite && lookSpr.name == "wall") {
            this.lastStunTime = time;
            this.scene.wallManager.wallSprites.forEach(wall => {
                if (xmov != 0) {
                    if (this.sprite.x + xmov == wall.x) {
                        if (this.scene.isEnemyAt(this.sprite.x, wall.y)) {
                            var tile = this.scene.map.getTileAtWorldXY(this.sprite.x, wall.y);
                            var enemy = this.scene.enemyManager.getEnemyByTile(tile);
                            if (enemy != null) {
                                enemy.stunEnemy();
                            }
                        }

                        var obj = this.scene.getObjAt(this.sprite.x, wall.y);
                        if (obj instanceof Block) {
                            if(obj.special || obj.cagedEnemy)
                            {
                                if (this.scene.isTileOpenAt(this.sprite.x - xmov, wall.y)) {
                                    obj.sprite.x -= xmov;
                                }
                            }
                        }

                        this.scene.tweens.timeline({
                            targets: wall,
                            ease: 'Linear',
                            duration: 20,
                            tweens: [{
                                x: wall.x,
                            },
                            {
                                y: wall.y,
                            },
                            {
                                x: wall.x - xmov / 4,
                            },
                            {
                                y: wall.y - xmov / 4,
                            },
                            {
                                x: wall.x,
                            },
                            {
                                y: wall.y,
                            }]

                        });
                    }
                } else if (ymov != 0) {
                    if (this.sprite.y + ymov == wall.y) {
                        if (this.scene.isEnemyAt(wall.x, this.sprite.y)) {
                            var tile = this.scene.map.getTileAtWorldXY(wall.x, this.sprite.y);
                            var enemy = this.scene.enemyManager.getEnemyByTile(tile);
                            if (enemy != null) {
                                enemy.stunEnemy();
                            }
                        }

                        var obj = this.scene.getObjAt(wall.x, this.sprite.y);
                        if (obj instanceof Block) {
                            if(obj.special || obj.cagedEnemy)
                            {
                                if (this.scene.isTileOpenAt(wall.x, this.sprite.y - ymov)) {
                                    obj.sprite.y -= ymov;
                                }
                            }
                        }

                        this.scene.tweens.timeline({
                            targets: wall,
                            ease: 'Linear',
                            duration: 20,
                            tweens: [{
                                x: wall.x,
                            },
                            {
                                y: wall.y,
                            },
                            {
                                x: wall.x - ymov / 4,
                            },
                            {
                                y: wall.y - ymov / 4,
                            },
                            {
                                x: wall.x,
                            },
                            {
                                y: wall.y,
                            }]

                        });
                    }
                }
            });
        }
    }
}