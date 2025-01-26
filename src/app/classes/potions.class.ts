import { GlobalstateserviceService } from '../services/globalstate.service';
import { StaticObjects } from './staticObjects.class';

export class Potions extends StaticObjects {

  hasPickedUp: boolean = false;

  constructor(scene: Phaser.Scene, globalStates: GlobalstateserviceService) {
    super(scene, globalStates);
    this.posX = this.randomizePosition(900, 1920 * 2);
    this.posY = this.randomizePosition(900, 1000); // max 1000 min 
  }

  preload() {
    this.loadImages(8, 'potion', 'assets/objects/green_potions/');
  }

  create() {
    this.objectSprite = this.scene.physics.add
      .sprite(this.posX, this.posY, 'potion1')
      .setScale(0.6)
      this.objectSprite.setBounce(0.5)
      this.objectSprite.setCollideWorldBounds(true)
      this.objectSprite.body.setSize(120, 120)
      this.objectSprite.body.setOffset(30, 110)
      this.loadAnimations()
  }

  update() {
    if (!this.hasPickedUp) {
      this.idle(this.objectSprite, 'potions_anim')
    }
    
  }

  loadAnimations() {
    if (!this.scene.anims.exists('potions_anim')) {
      this.scene.anims.create({
        key: 'potions_anim',
        frames: this.getSpriteImages('potion', 8),
        frameRate: 9,
        repeat: -1,
      });
    }
  }
}
