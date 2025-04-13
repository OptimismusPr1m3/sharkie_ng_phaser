import { GlobalstateserviceService } from '../services/globalstate.service';
import { MovableObjects } from './movableObjects.class';

export class Jellyfish extends MovableObjects {

  enemySprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  color!: string
  animationFrameRate!:number
  
  

  constructor(
    scene: Phaser.Scene, globalStates: GlobalstateserviceService, color: string
  ) {
    super(scene, globalStates);
    this.width = 180;
    this.height = 180;
    this.offsetX = 20;
    this.offsetY = 40;
    this.posY = this.randomizePosition(200, 1000);
    this.posX = this.randomizePosition(900, 960 * 6);
    this.setUpJelly()
    this.color = color
  }

  preload() {
    if (this.color === 'lila') {
      this.loadImages(4, 'lila_aggro_swim', 'assets/enemies/jellyfish/regular_damage/Lila');
      this.loadImages(4, 'lila_dead_animation', 'assets/enemies/jellyfish/dead/lila/');
    } else if (this.color === 'yellow') {
      this.loadImages(4, 'yellow_aggro_swim', 'assets/enemies/jellyfish/regular_damage/Yellow');
      this.loadImages(4, 'yellow_dead_animation', 'assets/enemies/jellyfish/dead/yellow/');
    }

  }

  create() {
    this.enemySprite = this.scene.physics.add
      .sprite(this.posX, this.posY, `${this.color}_aggro_swim1`)
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
      this.speed = -60
      this.animationFrameRate = 2
      console.log('FrameRate: ', this.frameRate)
    } else if (this.frameRate < -6 || this.frameRate < -4) {
      console.log('FrameRate: ', this.frameRate)
      this.speed = -90
      this.animationFrameRate = 4
    } else {
      console.log('FrameRate: ', this.frameRate)
      this.speed = -150
      this.animationFrameRate = 6
    }

    console.log(this.speed)
  }

  update() {
    this.manageEnemy();
  } 

  manageEnemy() {
    if (!this.isDead) {
      this.moveX(this.enemySprite, this.speed, `${this.color}_aggro_swim_anim`, false);
    }
  }

  checkDeathState() {
    if (this.isDead) {
      this.enemySprite.setVelocity(0);
        this.enemySprite.anims.play(`${this.color}_dead_anim`).once('animationcomplete', () => {
            this.hasDied = true;
        });

    }
}
 
  loadAnimations() {  
    if (!this.scene.anims.exists(`${this.color}_aggro_swim_anim`)) {
      this.scene.anims.create({
        key: `${this.color}_aggro_swim_anim`,
        frames: this.getSpriteImages(`${this.color}_aggro_swim`, 4),
        frameRate: this.animationFrameRate,
        repeat: -1,
      });
    }
    
    if (!this.scene.anims.exists(`${this.color}_dead_anim`)) {
      this.scene.anims.create({
        key: `${this.color}_dead_anim`,
        frames: this.getSpriteImages(`${this.color}_dead_animation`, 4),
        frameRate: 4,
        repeat: 0,
      });
    }

  }

}
