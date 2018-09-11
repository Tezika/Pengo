import 'phaser';
import { Direction } from './block.js';

export default class Player {
    constructor(scene, tileX, tileY) {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(0, 0, "player", 0);
        this.sprite.scaleX = .5;
        this.sprite.scaleY = .5;
        this.sprite.x = this.scene.map.tileToWorldX(tileX) + 16;
        this.sprite.y = this.scene.map.tileToWorldY(tileY) + 16;

        this.cursors = scene.input.keyboard.createCursorKeys();
        this.scene.physics.add.collider(this.sprite, this.backgroundLayer);
        this.lastMoveTime = 0;
        this.lastPushTime = 0;

        this.spaceBar = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update(time) {
        this.push(time);
        this.updateMovement(time);
    }

    updateMovement(time) {
        var tw = this.scene.tileWidth;
        var th = this.scene.tileHeight;

        var repeatMoveDelay = 100;

        if (time > this.lastMoveTime + repeatMoveDelay) {
            if (this.cursors.down.isDown) {
                this.sprite.angle = 90;
                if (this.scene.isTileOpenAt(this.sprite.x, this.sprite.y + th)) {
                    this.sprite.y += th;
                    this.lastMoveTime = time;
                }
            }
            else if (this.cursors.up.isDown) {
                this.sprite.angle = 270;
                if (this.scene.isTileOpenAt(this.sprite.x, this.sprite.y - th)) {
                    this.sprite.y -= th;
                    this.lastMoveTime = time;
                }
            }

            if (this.cursors.left.isDown) {
                this.sprite.angle = 180;
                if (this.scene.isTileOpenAt(this.sprite.x - tw, this.sprite.y)) {
                    this.sprite.x -= tw;
                    this.lastMoveTime = time;
                }
            }
            else if (this.cursors.right.isDown) {
                this.sprite.angle = 0;
                if (this.scene.isTileOpenAt(this.sprite.x + tw, this.sprite.y)) {
                    this.sprite.x += tw;
                    this.lastMoveTime = time;
                }
            }
        }
    }

    push(time) {
        var repeatPushDelay = 100;
        if (time > this.lastPushTime + repeatPushDelay) {
            var tw = this.scene.tileWidth;
            var th = this.scene.tileHeight;
            if (this.spaceBar.isDown) {
                var xmov = tw;
                var ymov = th;
                var dir = Direction.Up;
                switch (this.sprite.angle) {
                    case 0: //right
                        dir = Direction.Right;
                        ymov = 0;
                        break;
                    case 90: //down
                        dir = Direction.Down;
                        xmov = 0;
                        break;
                    case -180: //left
                        dir = Direction.Left;
                        xmov = -xmov;
                        ymov = 0;
                        break;
                    case -90: //up
                        dir = Direction.Up;
                        xmov = 0;
                        ymov = -ymov;
                        break;
                    default:
                        break;
                }

                this.scene.blockManager.blocks.forEach(block => {
                    if (this.sprite.x + xmov == block.sprite.x && this.sprite.y + ymov == block.sprite.y) {
                        if (!this.scene.isTileOpenAt(block.sprite.x + xmov, block.sprite.y + ymov)) {
                            block.destroy();
                        }
                        else {
                            block.move(dir);
                        }
                    }
                });

                var lookSpr = this.scene.getObjAt(this.sprite.x + xmov, this.sprite.y + ymov);
                if (lookSpr instanceof Phaser.GameObjects.Sprite && lookSpr.name == "wall") {
                    this.scene.wallSprites.forEach(wall => {
                        if (xmov != 0) {
                            if (this.sprite.x + xmov == wall.x) {
                                if(this.scene.isEnemyAt(this.sprite.x, wall.y))
                                {
                                    //var enemy = this.scene.getObjAt(this.sprite.x, wall.y);
                                    //enemy.stunEnemy();
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
                                if(this.scene.isEnemyAt(wall.x, this.sprite.y))
                                {
                                    //var enemy = this.scene.getObjAt(wall.x, this.sprite.y);
                                    //enemy.stunEnemy();
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

                this.lastPushTime = time;
            }
        }
    }

    Die() {

    }
}