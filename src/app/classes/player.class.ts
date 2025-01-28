import Phaser from 'phaser';
import { MovableObjects } from './movableObjects.class';
import { KeyboardInputs } from './keyboardInputs.class';
import { CustomKeys } from '../interfaces/CustomKeys.interface';
import { Throwable } from './throwable.class';
import { GlobalstateserviceService } from '../services/globalstate.service';

export class Player extends MovableObjects {
  playerSprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  keyObject!: Phaser.Input.Keyboard.Key;
  keyboardInput!: KeyboardInputs;
  throwable_pois!: Throwable;
  throwable_white!: Throwable;
  isLongIdle: boolean = false;
  idleThreshold: number = 3000;
  lastInputTime: number = 0;
  isHit: boolean = false;
  damageCooldown: boolean = false;
  constructor(
    scene: Phaser.Scene,
    public globalStateService: GlobalstateserviceService
  ) {
    super(scene, globalStateService);
    this.keyboardInput = new KeyboardInputs(scene);
    this.width = 500;
    this.height = 400;
    this.offsetX = 160;
    this.offsetY = 400;
    this.speed = 360;
    this.throwable_pois = new Throwable(
      scene,
      'poisoned_bubble',
      'assets/sharkie/attack/bubble_trap/poisoned_bubble.png',
      globalStateService
    );
    this.throwable_white = new Throwable(
      scene,
      'white_bubble',
      'assets/sharkie/attack/bubble_trap/white_bubble.png',
      globalStateService
    );
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
    this.loadImages(
      8,
      'white_bubble_trap_anim',
      'assets/sharkie/attack/bubble_trap/white/'
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
    this.throwable_pois.preload();
    this.throwable_white.preload();
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
    if (this.isAttacking) return;

    if (
      (keys.down.isDown ||
      keys.up.isDown ||
      keys.left.isDown ||
      keys.right.isDown) && !this.isHit
    ) {
      this.manageMovement(keys);
      this.isLongIdle = false;
      this.lastInputTime = this.scene.time.now;
    } else if ((keys.slap.isDown || keys.space.isDown || keys.w_bubble.isDown) && !this.isHit) {
      this.manageAttacks(keys);
      this.isLongIdle = false;
      this.lastInputTime = this.scene.time.now;
    } else if (
      this.scene.time.now - this.lastInputTime > this.idleThreshold && !this.isHit
    ) {
      this.manageLongIdle();
    } else if (!this.isHit) {
      this.idle(this.playerSprite, 'idle');
    }
  }

  manageLongIdle() {
    if (this.isLongIdle) return;
    this.isLongIdle = true;
    this.playerSprite.anims
      .play('long_idle_transition')
      .once('animationcomplete', () => {
        this.playerSprite.anims.play('long_idle_anim');
      });
  }

  hasBeenHit(damage: number) {
    if (this.damageCooldown)return;

    this.isHit = true;
    this.damageCooldown = true;
    this.playerSprite.setVelocity(0);
    this.playerSprite.anims.play('poisoned_hurt').once('animationcomplete', () => {
      this.idle(this.playerSprite, 'idle');
      this.globalStateService.modifyProgressbar('health', damage);
      this.isHit = false;
    })

    this.scene.time.delayedCall(4000, () => {
      this.damageCooldown = false;
    });

  }

  manageMovement(keys: CustomKeys) {
    if (this.isAttacking) return;

    if (keys.left?.isDown) {
      this.moveX(this.playerSprite, -this.speed, 'swim', true);
    } else if (keys.right?.isDown) {
      this.moveX(this.playerSprite, this.speed, 'swim', false);
    } else if (keys.up?.isDown) {
      this.moveY(this.playerSprite, -this.speed, 'swim');
    } else if (keys.down?.isDown) {
      this.moveY(this.playerSprite, this.speed, 'swim');
    }
  }

  manageAttacks(keys: CustomKeys) {
    if (this.isAttacking) return;

    if (keys.space?.isDown && !this.attackKeyPressed) {
      this.attackKeyPressed = true;
      this.bubbleAttack(this.playerSprite, 'green_bubble_trap', true);
    } else if (keys.w_bubble?.isDown && !this.attackKeyPressed) {
      this.attackKeyPressed = true;
      this.bubbleAttack(this.playerSprite, 'white_bubble_trap', false);
    } else if (keys.slap?.isDown && !this.attackKeyPressed) {
      this.attackKeyPressed = true;
      this.attackAnimation(this.playerSprite, 'fin_slap', 'idle');
    }
  }

  bubbleAttack(
    sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    animation: string,
    isPooisoned: boolean
  ) {
    if (this.isAttacking) return;
    sprite.setVelocity(0);
    this.isAttacking = true;
    sprite.anims.play(animation).once('animationcomplete', () => {
      this.idle(sprite, 'idle');
      this.isAttacking = false;
      if (isPooisoned) {
        this.globalStateService.modifyProgressbar('potions', -1);
        this.throwable_pois.spawnThrowable(
          sprite.flipX ? sprite.x - 100 : sprite.x + 100, // position form bubble to left or right depending on player direction
          sprite.y + 40,
          sprite.flipX ? -300 : 300, //speed to left or right depending on player direction
          'green'
        );
      } else {
        this.throwable_white.spawnThrowable(
          sprite.flipX ? sprite.x - 100 : sprite.x + 100, // position form bubble to left or right depending on player direction
          sprite.y + 40,
          sprite.flipX ? -300 : 300, //speed to left or right depending on player direction
          'white'
        );
      }
      this.attackKeyPressed = false;
    });
  }

  getPBubbles() {
    return this.globalStateService.getPBubbles();
  }
  getWBubbles() {
    return this.globalStateService.getWBubbles();
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
      key: 'long_idle_transition',
      frames: this.getSpriteImages('long_idle_anim', 14),
      frameRate: 6,
      repeat: 0,
    });
    this.scene.anims.create({
      key: 'long_idle_anim',
      frames: this.getSpriteImages('long_idle_anim', 14).slice(9, 14),
      frameRate: 3,
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
      repeat: 0,
    });
    this.scene.anims.create({
      key: 'no_bubble_trap',
      frames: this.getSpriteImages('no_bubble_trap_anim', 8),
      frameRate: 9,
      repeat: 0,
    });
    this.scene.anims.create({
      key: 'white_bubble_trap',
      frames: this.getSpriteImages('white_bubble_trap_anim', 8),
      frameRate: 9,
      repeat: 0,
    });
    this.scene.anims.create({
      key: 'fin_slap',
      frames: this.getSpriteImages('fin_slap_anim', 8),
      frameRate: 9,
      repeat: 0,
    });

    // HURT ANIMATIONS
    this.scene.anims.create({
      key: 'poisoned_hurt',
      frames: this.getSpriteImages('poisoned_hurt_anim', 5),
      frameRate: 6,
      repeat: 0,
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
