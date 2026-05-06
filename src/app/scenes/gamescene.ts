import Phaser from 'phaser';
import { Background } from '../classes/background.class';
import { Player } from '../classes/player.class';
import { Jellyfish } from '../classes/jellyfish.class';
import { GlobalstateserviceService } from '../services/globalstate.service';
import { Pufferfish } from '../classes/pufferfish.class';
import { Potions } from '../classes/potions.class';
import { Progressbar } from '../classes/progressbar.class';
import { Coins } from '../classes/coins.class';
import { Boss } from '../classes/boss.class';
import { Audio } from '../classes/audio.class';
import { GAME_CONFIG } from '../game.config';

export class Gamescene extends Phaser.Scene {
  private background!: Background;
  private player!: Player;
  private boss!: Boss;
  private enemies: (Jellyfish | Pufferfish)[] = [];
  private objects: (Potions | Coins)[] = [];
  private enemiesGroup!: Phaser.Physics.Arcade.Group;
  private objectsGroup!: Phaser.Physics.Arcade.Group;
  private progressBars: Progressbar[] = [];
  private fpsText!: Phaser.GameObjects.Text;
  private debugGraphics: Phaser.GameObjects.Graphics | null = null;
  private backgroundMusic!: Audio;

  constructor(public globalStateService: GlobalstateserviceService) {
    super({ key: 'Gamescene' });
    this.background = new Background(this, globalStateService);
    this.player = new Player(this, globalStateService);
    this.boss = new Boss(this, globalStateService);
    this.backgroundMusic = new Audio(this);
    this.progressBars = [
      new Progressbar(this, 'health', globalStateService, 50),
      new Progressbar(this, 'coin', globalStateService, 190),
      new Progressbar(this, 'potions', globalStateService, 120),
    ];
    this.enemies = [
      new Jellyfish(this, globalStateService, 'lila'),
      new Jellyfish(this, globalStateService, 'yellow'),
      new Jellyfish(this, globalStateService, 'lila'),
      new Pufferfish(this, globalStateService),
      new Pufferfish(this, globalStateService),
      new Pufferfish(this, globalStateService),
      new Pufferfish(this, globalStateService),
    ];
    this.objects = [
      new Potions(this, this.globalStateService),
      new Potions(this, this.globalStateService),
      new Potions(this, this.globalStateService),
      new Potions(this, this.globalStateService),
      new Potions(this, this.globalStateService),
      new Potions(this, this.globalStateService),
      new Coins(this, this.globalStateService),
      new Coins(this, this.globalStateService),
      new Coins(this, this.globalStateService),
      new Coins(this, this.globalStateService),
      new Coins(this, this.globalStateService),
      new Coins(this, this.globalStateService),
    ];
  }

  private createObjects(objects: { create(): void }[]) {
    objects.forEach((obj) => obj.create());
  }

  private updateObjects(objects: { update(): void }[]) {
    objects.forEach((obj) => obj.update());
  }

  preload() {
    this.background.preload();
    this.enemies.forEach((enemy) => enemy.preload());
    this.objects.forEach((obj) => obj.preload());
    this.progressBars.forEach((bar) => bar.preload());
    this.player.preload();
    this.boss.preload();
    this.backgroundMusic.preload();
  }

  create() {
    this.physics.world.setBounds(0, 0, GAME_CONFIG.WORLD_WIDTH, GAME_CONFIG.SCREEN_HEIGHT);  // set worldbounds i.e max traveling amount of sharkie
    this.background.create();
    this.createObjects(this.progressBars);
    this.setupPhysicsGroups();

    this.player.create();
    this.boss.create();

    this.cameras.main.startFollow(
      this.player.playerSprite,
      true,
      0.1,
      0.1,
      GAME_CONFIG.CAMERA_OFFSET_X
    ); // CAMERA_OFFSET_X offset to camera scroll deadzone
    this.cameras.main.setBounds(0, 0, GAME_CONFIG.WORLD_WIDTH, GAME_CONFIG.SCREEN_HEIGHT); // set worldbounds i.e max traveling amount of sharkie

    this.setupCollider();
    this.fpsText = this.add
      .text(GAME_CONFIG.SCREEN_WIDTH / 2, 20, '', { fontSize: '24px', color: '#D6195E', fontFamily: 'LGUY' })
      .setScrollFactor(0);
    this.backgroundMusic.create();
    this.fpsText.setVisible(false);
    this.sys.game.events.emit('scene-booted');
  }

  setupCollider() {
    this.physics.add.overlap(
      this.player.playerSprite,
      this.enemiesGroup,
      this.handlePlayerEnemyCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );
    this.physics.add.overlap(
      this.player.playerSprite,
      this.objectsGroup,
      this.handlePlayerPotionCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );
    this.physics.add.overlap(
      this.boss.bossSprite,
      this.player.playerSprite,
      this.handlePlayerBossCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );
  }

  handlePlayerEnemyCollision(
    _player: Phaser.Types.Physics.Arcade.GameObjectWithBody, // kann eigentlich geloescht werden
    _enemy: Phaser.Types.Physics.Arcade.GameObjectWithBody   // kann eigentlich geloescht werden
  ) {
    if (this.player.damageCooldown) return;
    this.player.hasBeenHit(-1);
  }

  handlePlayerBossCollision() {
    if (this.player.damageCooldown) return;
    this.boss.isAttacking = true;
    this.player.hasBeenHit(-2);
  }

  handlePlayerPotionCollision(
    _player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    potion: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) {
    const hitObject = this.objects.find((p) => p.objectSprite === potion);
    if (hitObject instanceof Potions) {
      const index = this.findIndexFromArray(this.objects, hitObject);
      hitObject.hasPickedUp = true;
      hitObject.objectSprite.destroy();
      this.deleteIndexFromArray(this.objects, index);
      this.globalStateService.modifyProgressbar('potions', 1);
    } else if (hitObject instanceof Coins) {
      const index = this.findIndexFromArray(this.objects, hitObject);
      hitObject.hasPickedUp = true;
      hitObject.objectSprite.destroy();
      this.deleteIndexFromArray(this.objects, index);
      this.globalStateService.modifyProgressbar('coin', 1);
    }
  }

  private deleteIndexFromArray<T>(array: T[], index: number): void {
    array.splice(index, 1);
  }

  private findIndexFromArray<T>(array: T[], element: T): number {
    return array.findIndex((el) => el === element);
  }

  setupPhysicsGroups() {
    this.enemiesGroup = this.physics.add.group({ collideWorldBounds: false });
    this.enemies.forEach((enemy) => {
      enemy.create();
      this.enemiesGroup.add(enemy.enemySprite);
    });

    this.objectsGroup = this.physics.add.group({ collideWorldBounds: false });
    this.objects.forEach((obj) => {
      obj.create();
      this.objectsGroup.add(obj.objectSprite);
    });
  }

  override update() {
    this.checkCollisions(this.enemies);
    this.player.update();
    this.updateObjects(this.enemies);
    this.updateObjects(this.objects);
    this.updateObjects(this.progressBars);
    this.boss.update(this.player.playerSprite);
    this.garbageCollection();
    this.calculateBossDistance();
    this.checkFPSToggle();
    this.checkHitboxToggle();
    this.checkWinLoseState();
  }

  checkWinLoseState() {
    if (this.boss.hasDied) {
      this.globalStateService.playerWinState.set(true);
      this.globalStateService.isWinLoseScreen.set(true);
      this.backgroundMusic.pauseAudio('backgroundMusic');
    } else if (this.player.hasDied) {
      this.globalStateService.playerWinState.set(false);
      this.globalStateService.isWinLoseScreen.set(true);
      this.backgroundMusic.pauseAudio('backgroundMusic');
    }
  }

  checkHitboxToggle() {
    if (this.globalStateService.isShowingHitboxes()) {
      if (!this.debugGraphics) {
        this.physics.world.drawDebug = true;
        this.debugGraphics = this.physics.world.createDebugGraphic();
      }
    } else {
      if (this.debugGraphics) {
        this.debugGraphics.destroy();
        this.debugGraphics = null;
        this.physics.world.drawDebug = false;
      }
    }
  }

  checkFPSToggle() {
    if (this.globalStateService.isShowingFPS()) {
      this.fpsText.setVisible(true);
      this.fpsText.setText('FPS: ' + this.game.loop.actualFps.toFixed(0));
    } else {
      this.fpsText.setVisible(false);
    }
  }

  checkCollisions(objects: (Jellyfish | Pufferfish)[]) {
    objects.forEach((obj) => {
      if (obj instanceof Pufferfish) {
        this.checkPufferfishProximity(obj);
      }
    });
    this.poisonedBubbleCollisionCheck();
    this.whiteBubbleCollisionCheck();
    this.checkSlapCollision();
  }

  checkPufferfishProximity(enemy: Pufferfish) {
    if (enemy.isAggro) return;

    const distance = Phaser.Math.Distance.Between(
      this.player.playerSprite.x,
      this.player.playerSprite.y,
      enemy.enemySprite.x,
      enemy.enemySprite.y
    );
    if (distance < GAME_CONFIG.PUFFERFISH_AGGRO_DISTANCE) {
      enemy.isAggro = true;
      enemy.checkAggroState();
    }
  }

  garbageCollection() {
    this.enemies = this.enemies.filter((enemy) => {
      if (enemy.hasDied) {
        enemy.enemySprite.destroy();
        return false;
      }
      return true;
    });
    if (this.boss.hasDied && this.boss.bossSprite.active) {
      this.boss.bossSprite.destroy();
    }
  }

  poisonedBubbleCollisionCheck() {
    const bubbles = this.player.getPBubbles();
    bubbles.forEach((bubble) => {
      if (this.physics.overlap(bubble, this.boss.bossSprite)) {
        this.globalStateService.removePBubble(bubble);
        bubble.destroy();
        this.boss.healthPoints -= GAME_CONFIG.BOSS_DAMAGE_PER_HIT;
        this.boss.isHurted = true;
      }
    });
  }

  calculateBossDistance() {
    const distance = Phaser.Math.Distance.Between(
      this.player.playerSprite.x,
      this.player.playerSprite.y,
      this.boss.bossSprite.x,
      this.boss.bossSprite.y
    );
    // BOSS_SPAWN_DISTANCE (1120) distance for spawn in boss
    if (distance < GAME_CONFIG.BOSS_SPAWN_DISTANCE && !this.boss.hasSpawned) {
      this.boss.isSpawning = true;
    }
  }

  whiteBubbleCollisionCheck() {
    const bubbles = this.player.getWBubbles();
    bubbles.forEach((bubble) => {
      this.enemies.forEach((enemy) => {
        if (
          enemy instanceof Jellyfish &&
          this.physics.overlap(bubble, enemy.enemySprite)
        ) {
          this.globalStateService.removeWBubble(bubble);
          bubble.destroy();
          enemy.isDead = true;
          enemy.checkDeathState();
        }
      });
    });
  }

  checkSlapCollision() {
    const slapBoxes = this.globalStateService.getSlapBoxes();
    slapBoxes.forEach((slapBox) => {
      this.enemies.forEach((enemy) => {
        if (this.physics.overlap(slapBox, enemy.enemySprite)) {
          this.globalStateService.removeSlapBox(slapBox);
          slapBox.destroy();
          enemy.isDead = true;
          enemy.checkDeathState();
        }
      });
    });
  }
}
