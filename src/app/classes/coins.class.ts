import { GlobalstateserviceService } from '../services/globalstate.service';
import { StaticObjects } from './staticObjects.class';

export class Coins extends StaticObjects {
  constructor(scene: Phaser.Scene, globalStates: GlobalstateserviceService) {
    super(scene, globalStates);
    this.posX = this.randomizePositions(900, 1920 * 4, 'X');
    this.posY = this.randomizePositions(900, 1000, 'Y');
  }

  preload() {
    this.loadImages(4, 'coins', 'assets/objects/coins/');
  }

  create() {
    this.objectSprite = this.scene.physics.add
      .sprite(this.posX, this.posY, 'coins1')
      .setScale(0.8);
    this.objectSprite.setBounce(0.5);
    this.objectSprite.setCollideWorldBounds(true);
    this.objectSprite.body.setSize(90, 90);
    this.objectSprite.body.setOffset(5 , 0);
    this.loadAnimations();
  }

  update() {
    if (!this.hasPickedUp) {
      this.idle(this.objectSprite, 'coins_anim')
    }
    
  }

  loadAnimations() {
    if (!this.scene.anims.exists('coins_anim')) {
      this.scene.anims.create({
        key: 'coins_anim',
        frames: this.getSpriteImages('coins', 4),
        frameRate: 5,
        repeat: -1,
      });
    }
  }
}
