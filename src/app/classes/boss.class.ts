import { GlobalstateserviceService } from '../services/globalstate.service';
import { MovableObjects } from './movableObjects.class';

export class Boss extends MovableObjects {
  bossSprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  constructor(scene: Phaser.Scene, globalStates: GlobalstateserviceService) {
    super(scene, globalStates);
    this.width = 900;
    this.height = 500;
    this.offsetX = 50;
    this.offsetY = 500;
    this.posY = this.randomizePosition(400, 600);
    this.posX = this.randomizePosition(300, 820 * 3);
  }

  preload() {
    this.loadImages(13, 'boss_idle', 'assets/boss/idle/');
    this.loadImages(4, 'boss_hurt', 'assets/boss/hurt/');
    this.loadImages(6, 'boss_dead', 'assets/boss/dead/');
    this.loadImages(6, 'boss_attacking', 'assets/boss/attacking/');
    this.loadImages(10, 'boss_spawn', 'assets/boss/spawn/');
  }

  create() {
    this.bossSprite = this.scene.physics.add
      .sprite(this.posX, this.posY, 'boss_idle1')
      .setScale(0.6)
    this.bossSprite.setBounce(0.0);
    this.bossSprite.setCollideWorldBounds(true);
    this.bossSprite.body.setSize(this.width, this.height);
    this.bossSprite.body.setOffset(this.offsetX, this.offsetY);
    this.loadAnimations();
  }

  update() {
    this.manageBoss();
  }

  manageBoss() {
    if (!this.isDead && !this.isAttacking) {
      this.idle(this.bossSprite, 'boss_idle_anim');
    }
  }

  loadAnimations() {
    if (!this.scene.anims.exists('boss_idle_anim')) {
      this.scene.anims.create({
        key: 'boss_idle_anim',
        frames: this.getSpriteImages('boss_idle', 13),
        frameRate: 8,
        repeat: -1,
      });
    }
  }
}
