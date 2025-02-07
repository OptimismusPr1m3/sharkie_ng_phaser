import { GlobalstateserviceService } from '../services/globalstate.service';
import { MovableObjects } from './movableObjects.class';

export class Jellyfish extends MovableObjects {

  enemySprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  
  

  constructor(
    scene: Phaser.Scene, globalStates: GlobalstateserviceService
  ) {
    super(scene, globalStates);
    this.width = 180;
    this.height = 180;
    this.offsetX = 20;
    this.offsetY = 40;
    this.posY = this.randomizePosition(200, 1000);
    this.posX = this.randomizePosition(900, 1920 * 3);
    this.setUpJelly()
  }

  preload() {
    this.loadImages(4, 'aggro_swim', 'assets/enemies/jellyfish/regular_damage/Lila');
    this.loadImages(4, 'dead_animation', 'assets/enemies/jellyfish/dead/lila/');
  }

  create() {
    this.enemySprite = this.scene.physics.add
      .sprite(this.posX, this.posY, 'aggro_swim1')
        .setScale(0.7);
    this.enemySprite.setBounce(0.0);
    this.enemySprite.setCollideWorldBounds(true);
    this.enemySprite.body.setSize(this.width, this.height);
    this.enemySprite.body.setOffset(this.offsetX, this.offsetY);
    this.loadAnimations();
  }

  setUpJelly() {
    this.frameRate = -this.randomizePosition(4, 9)
    if (this.frameRate < -8  || this.frameRate < -6) {
      this.speed = -20
      console.log('FrameRate: ', this.frameRate)
    } else if (this.frameRate < -6 || this.frameRate < -4) {
      console.log('FrameRate: ', this.frameRate)
      this.speed = -85
    } else {
      console.log('FrameRate: ', this.frameRate)
      this.speed = -120
    }

    console.log(this.speed)
  }

  update() {
    this.manageEnemy();
  } 

  manageEnemy() {
    if (!this.isDead) {
      this.moveX(this.enemySprite, this.speed, 'aggro_swim_anim', false);
    }
  }

  checkDeathState() {
    if (this.isDead) {
      this.enemySprite.setVelocity(0);
        this.enemySprite.anims.play('dead_anim').once('animationcomplete', () => {
            this.hasDied = true;
        });

    }
}
 
  loadAnimations() {  
    if (!this.scene.anims.exists('aggro_swim_anim')) {
      this.scene.anims.create({
        key: 'aggro_swim_anim',
        frames: this.getSpriteImages('aggro_swim', 4),
        frameRate: Math.random() * 5,
        repeat: -1,
      });
    }
    
    if (!this.scene.anims.exists('dead_anim')) {
      this.scene.anims.create({
        key: 'dead_anim',
        frames: this.getSpriteImages('dead_animation', 4),
        frameRate: 4,
        repeat: 0,
      });
    }

  }

}
