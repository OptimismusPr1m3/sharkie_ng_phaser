import Phaser from 'phaser';
import { Background } from '../classes/background.class';
import { Player } from '../classes/player.class';
import { Jellyfish } from '../classes/jellyfish.class';
import { GlobalstateserviceService } from '../services/globalstate.service';
import { Pufferfish } from '../classes/pufferfish.class';
import { StaticObjects } from '../classes/staticObjects.class';
import { Potions } from '../classes/potions.class';
import { Progressbar } from '../classes/progressbar.class';

export class Gamescene extends Phaser.Scene {
  private background!: Background;
  private player!: Player;
  private enemies: Jellyfish[] | Pufferfish[] = [];
  private objects: Potions[] = [];
  private enemiesGroup!: Phaser.Physics.Arcade.Group;
  private potionsGroup!: Phaser.Physics.Arcade.Group;
  private progressBars: Progressbar[] = [];

  constructor(public globalStateService: GlobalstateserviceService) {
    super({ key: 'Gamescene' });
    this.background = new Background(this, globalStateService);
    this.player = new Player(this, globalStateService);
    this.progressBars = [
      new Progressbar(this, 'health', globalStateService, 50),
      new Progressbar(this, 'coin', globalStateService, 190),
      new Progressbar(this, 'potions', globalStateService, 120),
    ];
    this.enemies = [
      new Jellyfish(this, globalStateService),
      new Jellyfish(this, globalStateService),
      new Jellyfish(this, globalStateService),
      new Pufferfish(this, globalStateService, 800),
      new Pufferfish(this, globalStateService, 1200),
      new Pufferfish(this, globalStateService, 1800),
    ];
    this.objects = [
      new Potions(this, this.globalStateService),
      new Potions(this, this.globalStateService),
      new Potions(this, this.globalStateService),
      new Potions(this, this.globalStateService),
      new Potions(this, this.globalStateService),
      new Potions(this, this.globalStateService),
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
    this.progressBars.forEach((bar) => bar.preload());
    this.player.preload();
  }

  create() {
    this.physics.world.setBounds(0, 0, 1920 * 2, 1080);
    this.background.create();
    this.createObjects(this.progressBars)
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
    this.physics.add.overlap(
      this.player.playerSprite,
      this.potionsGroup,
      this.handlePlayerPotionCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    )
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
    console.log(this.enemies)
  }

  handlePlayerPotionCollision(
    player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    potion: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) {
    const hitPotion = this.objects.find((p) => p.objectSprite === potion)
    if (hitPotion) {
      const index = this.findIndexFromArray(this.objects, hitPotion);
      console.log('Kollision mitPotion!');
      hitPotion.hasPickedUp = true;
      hitPotion.objectSprite.destroy();
      this.deleteIndexFromArray(this.objects, index);
      this.globalStateService.modifyProgressbar('potions', 1);
    }
    console.log(this.objects)
  }

  deleteIndexFromArray(array: any[], index: number) {
    array.splice(index, 1);
  }

  findIndexFromArray(array: any[], element: any) {
    return array.findIndex((el) => el === element);
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
    this.updateObjects(this.progressBars);
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
    this.enemies.forEach((enemy, index) => {
      if (enemy.hasDied) {
        console.log('Hier der Index', index);
        enemy.enemySprite.destroy();
        this.deleteIndexFromArray(this.enemies, index);
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
          enemy.checkDeathState();
        }
      });
    });
  }
}
