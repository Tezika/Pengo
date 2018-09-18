import 'phaser'
import Block from './block';
import { Scene } from "phaser";
import { Constant } from './game';

export default class SlimeManager {
    constructor(scene) {
        this.scene = scene;
        this.preload();
    }

    preload() {

    }

    create() {
        this.slimeSprites = [];

        this.scene.map.forEachTile(block => {
            if (block.properties.slime) {
                block.index = Constant.Empty_Tile_Index;
                var sprite = this.scene.physics.add.sprite(500, 500, "tar", 0);
                sprite.name = "slime";
                sprite.x = this.scene.map.tileToWorldX(block.x) + Constant.Tile_Size / 2;
                sprite.y = this.scene.map.tileToWorldY(block.y) + Constant.Tile_Size / 2;
                sprite.depth = 1;
                sprite.angle = (Math.random() * 360);
                this.slimeSprites.push(sprite);
            }
        });
    }

    update(time) {
        this.slimeSprites.forEach(slime => {
            if (this.scene.player.sprite.x == slime.x && this.scene.player.sprite.y == slime.y) {
                this.scene.player.slimed();
            }
        });
    }

    changeSlimePos()
    {
        this.slimeSprites.forEach(slime => {
            var tileY = Math.round(Math.random() * (this.scene.map.height-4))+2;
            var tileX = Math.round(Math.random() * (this.scene.map.width-4))+2;
            slime.x = this.scene.map.tileToWorldX(tileX) + Constant.Tile_Size / 2;
            slime.y = this.scene.map.tileToWorldY(tileY) + Constant.Tile_Size / 2;
        });
    }
}