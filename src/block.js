import { Scene } from "phaser";
import EnemyManager from "./enemymanager";
import { Constant } from "./game";

//Export a enum
export const Direction = {
    Up: 'Up',
    Down: 'Down',
    Left: 'Left',
    Right: 'Right'
}

export default class Block {
    constructor(scene, tile) {
        this.scene = scene;

        //add the block to the game scene's physics management.
        if (tile.properties.special) {

            this.scene.anims.create({
                key: 'wisp',
                frames: this.scene.anims.generateFrameNumbers('wisp', { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1
            });
    
            this.sprite = this.scene.physics.add.sprite(0, 0, "blockSpecial", 1);
            this.special = true;
            this.destructable = false;
            this.sprite.anims.play('wisp');
        }
        else {
            this.sprite = this.scene.physics.add.sprite(0, 0, "cage", 0);
            this.special = false;
            this.destructable = true;
        }

        this.sprite.x = this.scene.map.tileToWorldX(tile.x) + Constant.Tile_Size/2;
        this.sprite.y = this.scene.map.tileToWorldY(tile.y) + Constant.Tile_Size/2;
        this._moveSpeed = 10;
        this._moveDuration = 20;
        this._move = false;
        this._timer = 0;
        this._stopArea = 0;
        this._moveDir = Direction.Right;
    }

    move(dir) {
        if (this._move) {
            return;
        }

        this._move = true;
        this._timer = 0;
        this._moveDir = dir;

        switch (dir) {
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
    }

    update(time) {
        if (this._move) {
            if (time > this._moveDuration + this._timer) {
                //check whether the block needs to stop or not
                if (this.scene.isTileOpenAt(this.sprite.x + this._stopArea.x, this.sprite.y + this._stopArea.y)) {
                    this.sprite.x += this._moveVelocity.x;
                    this.sprite.y += this._moveVelocity.y;
                    this._timer = time;
                }
                else
                {
                    //if the next tile is enemy, then it pushes the enemy
                    var stopTile = this.scene.map.getTileAtWorldXY(this.sprite.x, this.sprite.y);
                    this.sprite.x = this.scene.map.tileToWorldX(stopTile.x) + Constant.Tile_Size/2;
                    this.sprite.y = this.scene.map.tileToWorldY(stopTile.y) + Constant.Tile_Size/2;
                    this._move = false;
                } 
                   
                //check there is any enemy in the moving direction
                if(this.scene.isEnemyAt(this.sprite.x + this._stopArea.x, this.sprite.y + this._stopArea.y))
                {
                    var tile = this.scene.map.getTileAtWorldXY(this.sprite.x + this._stopArea.x, this.sprite.y + this._stopArea.y);
                    var enemy = this.scene.enemyManager.getEnemyByTile(tile);
                    if(enemy != null && !enemy.pushing)
                    {
                        enemy.pushDir = this._moveDir;
                        enemy.pushing = true;
                        enemy.pusher = this;
                    }
                }
            }
        }
        if(this.special)
        {

            if (!this.scene.isTileOpenAt(this.sprite.x + this.scene.tileWidth, this.sprite.y)
                || !this.scene.isTileOpenAt(this.sprite.x - this.scene.tileWidth, this.sprite.y)
                || !this.scene.isTileOpenAt(this.sprite.x, this.sprite.y + this.scene.tileHeight)
                || !this.scene.isTileOpenAt(this.sprite.x, this.sprite.y - this.scene.tileHeight)) 
                {
                var up = this.scene.blockManager.getBlockAt(this.sprite.x, this.sprite.y - this.scene.tileHeight);
                var down = this.scene.blockManager.getBlockAt(this.sprite.x, this.sprite.y + this.scene.tileHeight);
                var left = this.scene.blockManager.getBlockAt(this.sprite.x - this.scene.tileWidth, this.sprite.y);
                var right = this.scene.blockManager.getBlockAt(this.sprite.x + this.scene.tileWidth, this.sprite.y);
                
                if(down != null && down.special ||
                    left != null && left.special ||
                    up != null && up.special ||
                    right != null && right.special)
                {
                    if((down != null && down.special && up != null && up.special) 
                    || (left != null && left.special && right != null && right.special) && !this.scene.wallManager.wallParty)
                    {
                        console.log("BONUS POINTS YAAA");
                        this.scene.wallManager.partyModeTimer = time;
                        this.scene.wallManager.wallParty = true;
                    }
                }
                else{
                }
            }
        }
    }

    destroy() {
        if (this.destructable) {
            this.scene.blockManager.remove(this);
            this.sprite.destroy();
        }
    }
}