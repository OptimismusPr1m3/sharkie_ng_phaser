import Phaser from 'phaser';
import { Background } from '../classes/background.class';
import { Player } from '../classes/player.class';
import { Jellyfish } from '../classes/jellyfish.class';
import { GlobalstateserviceService } from '../services/globalstate.service';
import { Pufferfish } from '../classes/pufferfish.class';
import { StaticObjects } from '../classes/staticObjects.class';
import { Potions } from '../classes/potions.class';

export class Gamescene extends Phaser.Scene {
  private background!: Background;
  private player!: Player;
  private enemies: Jellyfish[] | Pufferfish[] = [];
  private objects: Potions[] = [];
  private enemiesGroup!: Phaser.Physics.Arcade.Group;
  private potionsGroup!: Phaser.Physics.Arcade.Group;

  constructor(public globalStateService: GlobalstateserviceService) {
    super({ key: 'Gamescene' });
    this.background = new Background(this);
    this.player = new Player(this, globalStateService);
    this.enemies = [
      new Jellyfish(this, globalStateService),
      new Jellyfish(this, globalStateService),
      new Jellyfish(this, globalStateService),
      new Pufferfish(this, globalStateService, 800),
      new Pufferfish(this, globalStateService, 1200),
      new Pufferfish(this, globalStateService, 1800),
    ];
    this.objects = [
      new Potions(this),
      new Potions(this),
      new Potions(this),
      new Potions(this),
      new Potions(this),
      new Potions(this),
    ];
  }

  loadObjects(objects: any[]) {
    objects.forEach((obj) => {
      obj.preload();
    });
  }

  createObjects(objects: any[]) {
    objects.forEach((obj) => {
      obj.create();
    });
  }

  updateObjects(objects: any[]) {
    objects.forEach((obj) => {
      obj.update();
    });
  }

  preload() {
    this.background.preload();
    this.enemies.forEach((enemy) => enemy.preload());
    this.objects.forEach((obj) => obj.preload());
    this.player.preload();
  }

  create() {
    this.physics.world.setBounds(0, 0, 1920 * 2, 1080);
    this.background.create();

    this.setupPhysicsGroups();

    this.player.create();

    this.cameras.main.startFollow(
      this.player.playerSprite,
      true,
      0.1,
      0.1,
      -400
    ); // -400 offset to camera scroll deadzone
    this.cameras.main.setBounds(0, 0, 1920 * 2, 1080);

    this.setupCollider();
  }

  setupCollider() {
    this.physics.add.overlap(
      this.player.playerSprite,
      this.enemiesGroup,
      this.handlePlayerEnemyCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );
  }

  handlePlayerEnemyCollision(
    player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    enemy: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) {
    const hitEnemy = this.enemies.find((e) => e.enemySprite === enemy)
    if (hitEnemy instanceof Pufferfish) {
      console.log('Kollision mit einem Pufferfish!');
      this.checkPufferfishProximity(hitEnemy);
      this.checkSlapCollision(hitEnemy);
    } else if (hitEnemy instanceof Jellyfish) {
      console.log('Kollision mit einem Jellyfish!');
    }
  }

  setupPhysicsGroups() {
    this.enemiesGroup = this.physics.add.group({collideWorldBounds: true});
    this.enemies.forEach((enemy) => {
      enemy.create();
      this.enemiesGroup.add(enemy.enemySprite);
    });

    this.potionsGroup = this.physics.add.group({collideWorldBounds: true});
    this.objects.forEach((obj) => {
      obj.create();
      this.potionsGroup.add(obj.objectSprite);
    });
  }

  override update() {
    this.player.update();
    this.updateObjects(this.enemies);
    this.updateObjects(this.objects);
    this.checkCollisions(this.enemies);
    this.garbageCollection();
  }

  checkCollisions(objects: any) {
    objects.forEach((obj: any) => {
      if (obj instanceof Pufferfish) {
        this.checkPufferfishProximity(obj);
        this.checkSlapCollision(obj);
      }
    });
    //this.poisonedBubbleCollisionCheck();
    this.whiteBubbleCollisionCheck();
  }

  checkPufferfishProximity(enemy: Pufferfish) {
    if (enemy.isAggro) return;

    const distance = Phaser.Math.Distance.Between(
      this.player.playerSprite.x,
      this.player.playerSprite.y,
      enemy.enemySprite.x,
      enemy.enemySprite.y
    );
    if (distance < 400) {
      enemy.isAggro = true;
      enemy.checkAggroState();
    }
  }

  checkSlapCollision(enemy: Pufferfish) {
    if (enemy.isDead) return;
    console.log(this.globalStateService.hasSlapped())
    const distance = Phaser.Math.Distance.Between(
      this.player.playerSprite.x,
      this.player.playerSprite.y,
      enemy.enemySprite.x,
      enemy.enemySprite.y
    );
    if (distance < 300 && this.globalStateService.hasSlapped()) {
      enemy.isDead = true;
      enemy.enemySprite.setVelocityX(0);
      enemy.checkDeathState();
    } else {
      this.globalStateService.hasSlapped.set(false);
    }
  }

  garbageCollection() {
    this.enemies.forEach((enemy) => {
      if (enemy.hasDied) {
        enemy.enemySprite.destroy();
      }
    });
  }

  poisonedBubbleCollisionCheck() {
    const bubbles = this.player.getPBubbles();
    bubbles.forEach((bubble) => {
      this.enemies.forEach((enemy: Jellyfish) => {
        if (this.physics.overlap(bubble, enemy.enemySprite)) {
          this.globalStateService.removePBubble(bubble);
          bubble.destroy();
          enemy.isDead = true;
          enemy.enemySprite.destroy();
        }
      });
    });
  }

  whiteBubbleCollisionCheck() {
    const bubbles = this.player.getWBubbles();
    bubbles.forEach((bubble) => {
      this.enemies.forEach((enemy: Jellyfish) => {
        if (
          enemy instanceof Jellyfish &&
          this.physics.overlap(bubble, enemy.enemySprite)
        ) {
          this.globalStateService.removeWBubble(bubble);
          bubble.destroy();
          enemy.isDead = true;
          enemy.enemySprite.destroy();
        }
      });
    });
  }
}
