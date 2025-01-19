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
    this.posY = 720 / (Math.random() * 2);
    console.log(this.posY);
  }

  preload() {
    this.loadImages(4, 'aggro_swim', 'assets/enemies/jellyfish/regular_damage/Lila');
  }

  create() {
    this.enemySprite = this.scene.physics.add
      .sprite(500, this.posY, 'aggro_swim1')
        .setScale(0.7);
    this.enemySprite.setBounce(0.0);
    this.enemySprite.setCollideWorldBounds(true);
    this.enemySprite.body.setSize(this.width, this.height);
    this.enemySprite.body.setOffset(this.offsetX, this.offsetY);
    this.loadAnimations();
  }

  update() {
    this.manageEnemy();
  } 

  manageEnemy() {
    if (!this.isDead) {
      this.idle(this.enemySprite, 'aggro_swim');
    }
  }
 
  loadAnimations() {  
    this.scene.anims.create({
      key: 'aggro_swim',
      frames: this.getSpriteImages('aggro_swim', 4),
      frameRate: Math.random() * 5,
      repeat: -1,
    });
  }

}
