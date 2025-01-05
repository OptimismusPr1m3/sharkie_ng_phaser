import Phaser from 'phaser';
import { MovableObjects } from './movableObjects.class';
import { KeyboardInputs } from './keyboardInputs.class';

export class Player extends MovableObjects {
    playerSprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    keyObject!: Phaser.Input.Keyboard.Key;
    keyboardInput!: KeyboardInputs;

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.keyboardInput = new KeyboardInputs(scene);
    this.width = 500;
    this.height = 400;
    this.offsetX = 160;
    this.offsetY = 400;
  }

  preload() {
    // IDLE ANIMATIONS
    this.loadImages(18, 'idle_anim', 'assets/sharkie/idle/');
    this.loadImages(14, 'long_idle_anim', 'assets/sharkie/long_idle/');
    // SWIM ANIMATIONS
    this.loadImages(6, 'swim_anim', 'assets/sharkie/swim/');
    // ATTACK ANIMATIONS
    // Bubble Trap
    this.loadImages(
      8,
      'green_bubble_trap_anim',
      'assets/sharkie/attack/bubble_trap/green/'
    );
    this.loadImages(
      8,
      'no_bubble_trap_anim',
      'assets/sharkie/attack/bubble_trap/no_bubble/'
    );
    // Fin Slap
    this.loadImages(8, 'fin_slap_anim', 'assets/sharkie/attack/fin_slap/');
    //HURT ANIMATIONS
    this.loadImages(5, 'poisoned_hurt_anim', 'assets/sharkie/hurt/poisoned/');
    this.loadImages(3, 'shock_hurt_anim', 'assets/sharkie/hurt/shock/');
    //DEATH ANIMATIONS
    this.loadImages(12, 'poisoned_death_anim', 'assets/sharkie/dead/poisoned/');
    this.loadImages(10, 'shock_death_anim', 'assets/sharkie/dead/shock/');
    this.keyboardInput.initializeInputs();
  }

  create() {
    this.playerSprite = this.scene.physics.add
      .sprite(200, 1080 / 1.7, 'idle_anim1')
      .setScale(0.4);
    this.playerSprite.setBounce(0.0);
    this.playerSprite.setCollideWorldBounds(true);
    this.playerSprite.body.setSize(this.width, this.height);
    this.playerSprite.body.setOffset(this.offsetX, this.offsetY);
    this.loadAnimations();
  }

  update() {
    this.manageInputs();
  }

  manageInputs() {
    const keys = this.keyboardInput.getCursorKeys();
    if (keys.left?.isDown && !keys.left?.isUp) {
      this.moveX(this.playerSprite, -360, 'swim', true);
    } else if (keys.right?.isDown && !keys.right?.isUp) {
      this.moveX(this.playerSprite, 360, 'swim', false);
    } else if (keys.up?.isDown && !keys.up?.isUp) {
      this.moveY(this.playerSprite, -360, 'swim');
    } else if (keys.down?.isDown && !keys.down?.isUp) {
      this.moveY(this.playerSprite, 360, 'swim');
    } else if (keys.space?.isDown && !keys.space?.isUp) {
      this.attackAnimation(this.playerSprite, 'green_bubble_trap');
    } else if (keys.w_bubble?.isDown && !keys.w_bubble?.isUp) { //G key
      this.attackAnimation(this.playerSprite, 'no_bubble_trap');
    } else if (keys.slap?.isDown && !keys.slap?.isUp) { // F key
      this.attackAnimation(this.playerSprite, 'fin_slap');
    } else {
      this.idle(this.playerSprite, 'idle');
    }
  }

  loadAnimations() {
    // IDLE ANIMATIONS
    this.scene.anims.create({
      key: 'idle',
      frames: this.getSpriteImages('idle_anim', 18),
      frameRate: 9,
      repeat: -1,
    });
    this.scene.anims.create({
      key: 'long_idle',
      frames: this.getSpriteImages('long_idle_anim', 14),
      frameRate: 9,
      repeat: -1,
    });

    // SWIM ANIMATIONS
    this.scene.anims.create({
      key: 'swim',
      frames: this.getSpriteImages('swim_anim', 6),
      frameRate: 9,
      repeat: -1,
    });

    // ATTACK ANIMATIONS
    this.scene.anims.create({
      key: 'green_bubble_trap',
      frames: this.getSpriteImages('green_bubble_trap_anim', 8),
      frameRate: 9,
      repeat: -1,
    });
    this.scene.anims.create({
      key: 'no_bubble_trap',
      frames: this.getSpriteImages('no_bubble_trap_anim', 8),
      frameRate: 9,
      repeat: -1,
    });
    this.scene.anims.create({
      key: 'fin_slap',
      frames: this.getSpriteImages('fin_slap_anim', 8),
      frameRate: 9,
      repeat: -1,
    });

    // HURT ANIMATIONS
    this.scene.anims.create({
      key: 'poisoned_hurt',
      frames: this.getSpriteImages('poisoned_hurt_anim', 5),
      frameRate: 9,
      repeat: -1,
    });
    this.scene.anims.create({
      key: 'shock_hurt',
      frames: this.getSpriteImages('shock_hurt_anim', 3),
      frameRate: 9,
      repeat: -1,
    });

    // DEATH ANIMATIONS
    this.scene.anims.create({
      key: 'poisoned_death',
      frames: this.getSpriteImages('poisoned_death_anim', 12),
      frameRate: 9,
      repeat: -1,
    });
    this.scene.anims.create({
      key: 'shock_death',
      frames: this.getSpriteImages('shock_death_anim', 10),
      frameRate: 9,
      repeat: -1,
    });
  }


  
}
