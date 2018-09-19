import 'phaser'
import Block from './block';
import { Scene } from "phaser";
import { Constant } from './game';

export default class PortalManager {
    constructor(scene) {
        this.scene = scene;
        this.preload();
    }

    preload() {
     

    }

    create() {
        this.portals = [];
        this.cagedCount = 0;
        this.cageEntersPortalSound = this.scene.sound.add('cageEntersPortal');
        this.activePortalSound = this.scene.sound.add('portalActive');
        this.scene.map.forEachTile(block => {
            if (block.properties.portal) {
                block.index = 154;
                var sprite = this.scene.physics.add.sprite(0, 0, "portalGrey", 0);
                sprite.name = "portal";
                sprite.x = this.scene.map.tileToWorldX(block.x) + Constant.Tile_Size / 2;
                sprite.y = this.scene.map.tileToWorldY(block.y) + Constant.Tile_Size / 2;
                this.portals.push(sprite);
            }
        });
    }

    update(time) {
        if (this.scene.blockManager.specialActivated) {
            this.portals.forEach(sprite => {
                if (!this.scene.isTileOpenAt(sprite.x, sprite.y)) {
                    this.scene.blockManager.blocks.forEach(block => {
                        if (block.cagedEnemy) {
                            if (sprite.x == block.sprite.x && sprite.y == block.sprite.y) {
                                block.cagedEnemy = false;
                                this.scene.blockManager.cagedEnemies--;
                                block.destructable = true;
                                block.destroy();
                                this.cageDestroyed();
                            }
                        }
                    });
                }
            });
        }
        
        if(this.scene.blockManager.cagedEnemies == 0 && this.scene.enemyManager.enemies.length == 0 && !this.scene.wallManager.wallParty)
        {
            this.scene.wallManager.partyModeTimer = time;
            this.scene.wallManager.wallParty = true;
        }
    }

    activatePortals() {
        this.activePortalSound.play();
        this.portals.forEach(sprite => {
            sprite.setTexture("portal");
            this.scene.tweens.add({
                targets: sprite,
                ease: 'Linear',
                duration: 10000,
                angle: sprite.angle + 360,
                loop: -1,
            });
            this.scene.map.getTileAtWorldXY(sprite.x, sprite.y).resetCollision();
            this.scene.map.getTileAtWorldXY(sprite.x, sprite.y).index = 1;
        });

        this.scene.blockManager.blocks.forEach(block => {
            if (block.special) {
                block.sprite.anims.stopOnRepeat();
            }
        });
    }

    cageDestroyed()
    {
        var wallLen = this.scene.wallManager.skulls.length;
        var rnd = Math.round(Math.random() * wallLen);
        if(this.scene.wallManager.skulls[rnd].name == "cage")
        {
            rnd++;
        }
        if(rnd > wallLen)
        {
            rnd = 0;
        }
        this.cageEntersPortalSound.play();
        this.scene.wallManager.skulls[rnd].angle = 0;
        this.scene.wallManager.skulls[rnd].setTexture("enemyCage");
        this.scene.wallManager.skulls[rnd].anims.play('enemyCage', true);
        this.scene.wallManager.skulls[rnd].name = "cage";
        this.cagedCount++;
    }
}