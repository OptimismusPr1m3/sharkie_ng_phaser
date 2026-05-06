import Phaser from 'phaser';
import { MovableObjects } from './movableObjects.class';
import { KeyboardInputs } from './keyboardInputs.class';
import { CustomKeys } from '../interfaces/CustomKeys.interface';
import { Throwable } from './throwable.class';
import { GlobalstateserviceService } from '../services/globalstate.service';
import { GAME_CONFIG } from '../game.config';

type JoystickState = { left: boolean; right: boolean; up: boolean; down: boolean };

export class Player extends MovableObjects {
  playerSprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  keyObject!: Phaser.Input.Keyboard.Key;
  keyboardInput!: KeyboardInputs;
  throwable_pois!: Throwable;
  throwable_white!: Throwable;
  slapBox!: Throwable;
  isLongIdle: boolean = false;
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
    this.speed = GAME_CONFIG.PLAYER_SPEED;
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
    this.slapBox = new Throwable(
      scene,
      'slap_box',
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
    this.loadImages(8, 'green_bubble_trap_anim', 'assets/sharkie/attack/bubble_trap/green/');
    this.loadImages(8, 'no_bubble_trap_anim', 'assets/sharkie/attack/bubble_trap/no_bubble/');
    this.loadImages(8, 'white_bubble_trap_anim', 'assets/sharkie/attack/bubble_trap/white/');
    // Fin Slap
    this.loadImages(8, 'fin_slap_anim', 'assets/sharkie/attack/fin_slap/');
    //HURT ANIMATIONS
    this.loadImages(5, 'poisoned_hurt_anim', 'assets/sharkie/hurt/poisoned/');
    this.loadImages(3, 'shock_hurt_anim', 'assets/sharkie/hurt/shock/');
    //DEATH ANIMATIONS
    this.loadImages(12, 'poisoned_death_anim', 'assets/sharkie/dead/poisoned/');
    this.loadImages(10, 'shock_death_anim', 'assets/sharkie/dead/shock/');
    this.throwable_pois.preload();
    this.throwable_white.preload();
    this.slapBox.preload();
  }

  create() {
    this.keyboardInput.initializeInputs();
    this.playerSprite = this.scene.physics.add
      .sprite(200, GAME_CONFIG.SCREEN_HEIGHT / 1.7, 'idle_anim1')
      .setScale(0.4);
    this.playerSprite.setBounce(0.0);
    this.playerSprite.setCollideWorldBounds(true);
    this.playerSprite.body.setSize(this.width, this.height);
    this.playerSprite.body.setOffset(this.offsetX, this.offsetY);
    this.loadAnimations();
  }

  update() {
    this.manageInputs();
    this.checkHealth();
    this.manageDying();
  }

  manageDying() {
    if (this.isDead && !this.hasDied) {
      this.playerSprite.setVelocity(0);
      this.playerSprite.anims
        .play('poisoned_death', true)
        .once('animationcomplete', () => {
          this.hasDied = true;
        });
    }
  }

  checkHealth() {
    if (this.globalStateService.currentHealth() == 1 && !this.hasDied) {
      this.isDead = true;
    }
  }

  manageInputs() {
    const keys = this.keyboardInput.getCursorKeys();
    const joystick = this.keyboardInput.getJoystick();
    const isDesktop = this.scene.sys.game.device.os.desktop;

    if (this.isAttacking || this.isDead || this.hasDied) return;

    const isMoving = isDesktop
      ? (keys.down.isDown || keys.up.isDown || keys.left.isDown || keys.right.isDown)
      : (joystick.left || joystick.right || joystick.up || joystick.down);

    if (isMoving && !this.isHit && !this.isDead) {
      if (isDesktop) {
        this.manageMovement(keys);
      } else {
        this.manageMobileMovement(joystick);
      }
      this.isLongIdle = false;
      this.lastInputTime = this.scene.time.now;
    } else if ((keys.slap.isDown || keys.space.isDown || keys.w_bubble.isDown) && !this.isHit && !this.isDead) {
      this.manageAttacks(keys);
      this.isLongIdle = false;
      this.lastInputTime = this.scene.time.now;
    } else if (this.scene.time.now - this.lastInputTime > GAME_CONFIG.IDLE_THRESHOLD_MS && !this.isHit && !this.isDead) {
      this.manageLongIdle();
    } else if (!this.isHit && !this.isDead) {
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
    if (this.damageCooldown) return;

    this.isHit = true;
    this.damageCooldown = true;
    this.playerSprite.setVelocity(0);
    this.playerSprite.anims
      .play('poisoned_hurt')
      .once('animationcomplete', () => {
        this.idle(this.playerSprite, 'idle');
        this.globalStateService.modifyProgressbar('health', damage);
        this.isHit = false;
      });

    this.scene.time.delayedCall(GAME_CONFIG.DAMAGE_COOLDOWN_MS, () => {
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

  manageMobileMovement(joystick: JoystickState) {
    if (this.isAttacking) return;

    if (joystick.left) {
      this.moveX(this.playerSprite, -this.speed, 'swim', true);
    } else if (joystick.right) {
      this.moveX(this.playerSprite, this.speed, 'swim', false);
    } else if (joystick.up) {
      this.moveY(this.playerSprite, -this.speed, 'swim');
    } else if (joystick.down) {
      this.moveY(this.playerSprite, this.speed, 'swim');
    }
  }

  manageAttacks(keys: CustomKeys) {
    if (this.isAttacking) return;

    if (keys.space?.isDown && !this.attackKeyPressed && this.globalStateService.currentPotions() > 1) {
      this.attackKeyPressed = true;
      this.bubbleAttack(this.playerSprite, 'green_bubble_trap', true);
    } else if (keys.space?.isDown && !this.attackKeyPressed && this.globalStateService.currentPotions() == 1) {
      this.attackKeyPressed = true;
      this.noBubbleAttack(this.playerSprite, 'no_bubble_trap');
    } else if (keys.w_bubble?.isDown && !this.attackKeyPressed) {
      this.attackKeyPressed = true;
      this.bubbleAttack(this.playerSprite, 'white_bubble_trap', false);
    } else if (keys.slap?.isDown && !this.attackKeyPressed) {
      this.attackKeyPressed = true;
      this.finSlapAttack(this.playerSprite, 'fin_slap');
    }
  }

  finSlapAttack(
    sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    animation: string
  ) {
    if (this.isAttacking) return;
    sprite.setVelocity(0);
    this.isAttacking = true;
    sprite.anims.play(animation).once('animationcomplete', () => {
      this.slapBox.spawnThrowable(
        sprite.flipX ? sprite.x - GAME_CONFIG.ATTACK_OFFSET_X : sprite.x + GAME_CONFIG.ATTACK_OFFSET_X,
        sprite.y + GAME_CONFIG.ATTACK_OFFSET_Y,
        sprite.flipX ? -GAME_CONFIG.SLAP_SPEED : GAME_CONFIG.SLAP_SPEED,
        'slap'
      );
      this.isAttacking = false;
      this.attackKeyPressed = false;
    });
  }

  noBubbleAttack(
    sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    animation: string
  ) {
    if (this.isAttacking) return;
    sprite.setVelocity(0);
    this.isAttacking = true;
    sprite.anims.play(animation).once('animationcomplete', () => {
      this.isAttacking = false;
      this.attackKeyPressed = false;
    });
  }

  bubbleAttack(
    sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    animation: string,
    isPoisoned: boolean
  ) {
    if (this.isAttacking) return;
    sprite.setVelocity(0);
    this.isAttacking = true;
    sprite.anims.play(animation).once('animationcomplete', () => {
      this.isAttacking = false;
      if (isPoisoned) {
        this.globalStateService.modifyProgressbar('potions', -1);
        this.throwable_pois.spawnThrowable(
          sprite.flipX ? sprite.x - GAME_CONFIG.ATTACK_OFFSET_X : sprite.x + GAME_CONFIG.ATTACK_OFFSET_X, // position of bubble to left or right depending on player direction
          sprite.y + GAME_CONFIG.ATTACK_OFFSET_Y,
          sprite.flipX ? -GAME_CONFIG.BUBBLE_SPEED : GAME_CONFIG.BUBBLE_SPEED, // speed to left or right depending on player direction
          'green'
        );
      } else {
        this.throwable_white.spawnThrowable(
          sprite.flipX ? sprite.x - GAME_CONFIG.ATTACK_OFFSET_X : sprite.x + GAME_CONFIG.ATTACK_OFFSET_X, // position of bubble to left or right depending on player direction
          sprite.y + GAME_CONFIG.ATTACK_OFFSET_Y,
          sprite.flipX ? -GAME_CONFIG.BUBBLE_SPEED : GAME_CONFIG.BUBBLE_SPEED, // speed to left or right depending on player direction
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
      repeat: 0,
    });
    this.scene.anims.create({
      key: 'shock_death',
      frames: this.getSpriteImages('shock_death_anim', 10),
      frameRate: 9,
      repeat: 0,
    });
  }
}
