
import 'phaser';
import { Direction } from './block';

export default class Enemy
{
    constructor(scene, tileX, tileY)
    {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(0, 0, "pengs", 0);
        this.sprite.scaleX = .5;
        this.sprite.scaleY = .5;
        this.sprite.x = this.scene.map.tileToWorldX(tileX)+16;
        this.sprite.y= this.scene.map.tileToWorldY(tileY)+16;

        //AI stuff
        this._moveDir = Direction.Left;
        this._moveSpeed = 5;
        this._moveDuration = 80;
        this._moveVelocity = null;
        this._stopArea = null;
        this._timer = 0;

        //Push stuff
        this.pushing = false;
        this.pushingSpeed = 10;
        this.pushDir = Direction.Left;
        this.pusher  = null;
    }

    update(time)
    {
        if(this.pushing)
        {
            this.updatePushing();
        }
        else
        {
            this.updateMovement(time);
        }
    }

    updatePushing()
    {
        switch(this.pushDir)
        {
            case Direction.Up:
                this.sprite.y = this.pusher.sprite.y - this.scene.tileHeight;
                break;
            case Direction.Down:
                this.sprite.y = this.pusher.sprite.y + this.scene.tileHeight;
                break;
            case Direction.Left:
                this.sprite.x = this.pusher.sprite.x - this.scene.tileWidth;
                break;
            case Direction.Right:
                this.sprite.x = this.pusher.sprite.x + this.scene.tileWidth;
                break;
            default:
                break;
        }
        //when the enemy died.
        if(!this.scene.isTileOpenAt(this.sprite.x, this.sprite.y))
        {
            this.destroy();
        }
    }

    updateMovement(time)
    {
        if (time > this._moveDuration + this._timer)
        {
            switch ( this._moveDir)
            {
               case Direction.Up:
                   this._moveVelocity = new Phaser.Math.Vector2(0, -this._moveSpeed);
                   this._stopArea = new Phaser.Math.Vector2(0, -this.scene.tileHeight);
                   break;
               case Direction.Down:
                   this._moveVelocity = new Phaser.Math.Vector2(0, this._moveSpeed);
                   this._stopArea = new Phaser.Math.Vector2(0, this.scene.tileHeight);
                   break;
               case Direction.Left:
                   this._moveVelocity = new Phaser.Math.Vector2(-this._moveSpeed, 0);
                   this._stopArea = new Phaser.Math.Vector2(-this.scene.tileWidth, 0);
                   break;
               case Direction.Right:
                   this._moveVelocity = new Phaser.Math.Vector2(this._moveSpeed, 0);
                   this._stopArea = new Phaser.Math.Vector2(this.scene.tileWidth, 0)
                   break;
               default:
                   break;
           }
            //check whether the enemys to stop or not
            if (this.scene.isTileOpenAt(this.sprite.x + this._stopArea.x, this.sprite.y + this._stopArea.y))
             {
                this.sprite.x += this._moveVelocity.x;
                this.sprite.y += this._moveVelocity.y;
                this._timer = time;
             }
             else
             {
                 var stopTile = this.scene.map.getTileAtWorldXY(this.sprite.x, this.sprite.y);
                 this.sprite.x = this.scene.map.tileToWorldX(stopTile.x) + 16;
                 this.sprite.y = this.scene.map.tileToWorldY(stopTile.y) + 16;
                 this.getRandomMoveDir();
             }
        }
    }

    destroy()
    {
        this.scene.enemyManager.remove(this);
        this.sprite.destroy();
    }

    stunEnemy()
    {
        console.log("ENEMY STUNNNED");
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
            }]

        });
    }

    getRandomMoveDir()
    {
        //pick up a new direction
        var val =  Math.floor(Math.random() * Math.floor(4));
        switch(val)
        {
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
}