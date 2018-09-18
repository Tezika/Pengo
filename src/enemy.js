import 'phaser';
import Block from './block';
import { Direction } from './block';
import { Constant } from './game';

export default class Enemy {
    constructor(scene, tileX, tileY) {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(300, 300, "pengs", 0);
        this.sprite.x = this.scene.map.tileToWorldX(tileX) + Constant.Tile_Size / 2;
        this.sprite.y = this.scene.map.tileToWorldY(tileY) + Constant.Tile_Size / 2;
        this.sprite.depth = 4;
        this.sprite.name = "enemy";

        //AI stuff
        this._moveDir = Direction.Down;
        this.moveSpeed = 10;
        this._moveDuration = 80;
        this._moveVelocity = null;
        this._stopArea = null;
        this._timer = 0;

        //Stun
        this.stunned = false;
        this.stunTime = 2000;
        this.stunTimer = 0;

        //Push stuff
        this.pushing = false;
        this.pushingSpeed = 10;
        this.pushDir = Direction.Left;
        this.pusher = null;
        this.death = false;
        this.destroying = false;

        this.sprite.anims.play('enemyDown', true);
        this.sprite.on('animationcomplete', this.deathComplete, this);


        //Audio Stuff
        this.dieSound = this.scene.sound.add('penguinExplode');

        if(Math.random() > .95)
        {
            this.destroying = true;
            this.hsv = Phaser.Display.Color.HSVColorWheel();
            this.sprite.tint = this.hsv[300].color;
        }
    }

    update(time) {
        if (!this.death) {
            if (this.pushing) {
                this.updatePushing();
            }
            else {
                this.updateMovement(time);
            }
        }
    }

    updatePushing() {
        var x = this.sprite.x;
        var y = this.sprite.y;
        switch (this.pushDir) {
            case Direction.Up:
                y = this.pusher.sprite.y - this.scene.tileHeight;
                break;
            case Direction.Down:
                y = this.pusher.sprite.y + this.scene.tileHeight;
                break;
            case Direction.Left:
                x = this.pusher.sprite.x - this.scene.tileWidth;
                break;
            case Direction.Right:
                x = this.pusher.sprite.x + this.scene.tileWidth;
                break;
            default:
                break;
        }

        //when the enemy died.
        if (!this.scene.isTileOpenAt(x, y)) {
            this.destroy();
        }

        this.sprite.x = x;
        this.sprite.y = y;
    }

    updateMovement(time) {
        if(this.stunned && this.stunTimer == 0)
        {
            this.stunTimer = time;
            this._timer = 0;
        }

        if (time > this._moveDuration + this._timer && time > this.stunTime + this.stunTimer) {
            this.stunned = false;
            switch (this._moveDir) {
                case Direction.Up:
                    this._moveVelocity = new Phaser.Math.Vector2(0, -this.moveSpeed);
                    this._stopArea = new Phaser.Math.Vector2(0, -this.scene.tileHeight);
                    this.sprite.anims.play('enemyUp', true);
                    this.sprite.flipX = false;
                    break;
                case Direction.Down:
                    this._moveVelocity = new Phaser.Math.Vector2(0, this.moveSpeed);
                    this._stopArea = new Phaser.Math.Vector2(0, this.scene.tileHeight);
                    this.sprite.anims.play('enemyDown', true);
                    this.sprite.flipX = false;
                    break;
                case Direction.Left:
                    this._moveVelocity = new Phaser.Math.Vector2(-this.moveSpeed, 0);
                    this._stopArea = new Phaser.Math.Vector2(-this.scene.tileWidth, 0);
                    this.sprite.anims.play('enemySide', true);
                    this.sprite.flipX = false;
                    break;
                case Direction.Right:
                    this._moveVelocity = new Phaser.Math.Vector2(this.moveSpeed, 0);
                    this._stopArea = new Phaser.Math.Vector2(this.scene.tileWidth, 0);
                    this.sprite.anims.play('enemySide', true);
                    this.sprite.flipX = true;
                    break;
                default:
                    break;
            }
            //check whether the enemys to stop or not
            if (this.scene.isTileOpenAt(this.sprite.x + this._stopArea.x, this.sprite.y + this._stopArea.y)) {
                this.sprite.x += this._moveVelocity.x;
                this.sprite.y += this._moveVelocity.y;
                this._timer = time;
            }
            else if (this.destroying) {
                var block = this.scene.getObjAt(this.sprite.x + this._stopArea.x, this.sprite.y + this._stopArea.y);
                if (block != null && block instanceof Block && block.destructable) {
                    block.destroy();
                    this.sprite.x += this._moveVelocity.x;
                    this.sprite.y += this._moveVelocity.y;
                    this._timer = time;
                }
                else {
                    var stopTile = this.scene.map.getTileAtWorldXY(this.sprite.x, this.sprite.y);
                    this.sprite.x = this.scene.map.tileToWorldX(stopTile.x) + Constant.Tile_Size / 2;
                    this.sprite.y = this.scene.map.tileToWorldY(stopTile.y) + Constant.Tile_Size / 2;
                    this.getRandomMoveDir();
                }
            }
            else {
                var stopTile = this.scene.map.getTileAtWorldXY(this.sprite.x, this.sprite.y);
                this.sprite.x = this.scene.map.tileToWorldX(stopTile.x) + Constant.Tile_Size / 2;
                this.sprite.y = this.scene.map.tileToWorldY(stopTile.y) + Constant.Tile_Size / 2;
                this.getRandomMoveDir();
            }
        }
    }

    destroy() {
        this.dieSound.play();
        this.sprite.anims.play('enemyDeath', true);
        this.death = true;
    }

    destroyNoAnim() {
        this.scene.enemyManager.remove(this);
        this.sprite.destroy();
    }

    deathComplete(animation, frame) {
        if (animation.key == "enemyDeath") {
            this.scene.enemyManager.remove(this);
            this.sprite.destroy();
        }
    }

    stunEnemy() {
        this.stunned = true;
        this.stunTimer = 0;
        var stopTile = this.scene.map.getTileAtWorldXY(this.sprite.x, this.sprite.y);
        this.sprite.x = this.scene.map.tileToWorldX(stopTile.x) + Constant.Tile_Size / 2;
        this.sprite.y = this.scene.map.tileToWorldY(stopTile.y) + Constant.Tile_Size / 2;
        this.getRandomMoveDir();

        this.scene.tweens.timeline({
            targets: this.sprite,
            ease: 'Linear',
            duration: 20,
            tweens: [{
                x: this.sprite.x,
            },
            {
                y: this.sprite.y,
            },
            {
                x: this.sprite.x + 8,
            },
            {
                y: this.sprite.y + 8,
            },
            {
                x: this.sprite.x,
            },
            {
                y: this.sprite.y,
            }],
            onStart: this.onStunStart()
        });
    }

    getRandomMoveDir() {
        //pick up a new direction
        var val = Math.floor(Math.random() * Math.floor(4));
        switch (val) {
            case 0:
                this._moveDir = Direction.Up;
                break;
            case 1:
                this._moveDir = Direction.Down;
                break;
            case 2:
                this._moveDir = Direction.Left;
                break;
            case 3:
                this._moveDir = Direction.Right;
                break;
            default:
                break;
        }
    }

    onStunStart() {
        this.sprite.anims.play('enemyStun', true);
    }

}