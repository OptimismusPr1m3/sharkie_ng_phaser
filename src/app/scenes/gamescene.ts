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

export class Gamescene extends Phaser.Scene {
  private background!: Background;
  private player!: Player;
  private boss!: Boss;
  private enemies: (Jellyfish | Pufferfish)[] = [];
  private objects: Potions[] | Coins[] = [];
  private enemiesGroup!: Phaser.Physics.Arcade.Group;
  private objectsGroup!: Phaser.Physics.Arcade.Group;
  private progressBars: Progressbar[] = [];

  constructor(public globalStateService: GlobalstateserviceService) {
    super({ key: 'Gamescene' });
    this.background = new Background(this, globalStateService);
    this.player = new Player(this, globalStateService);
    this.boss = new Boss(this, globalStateService);
    this.progressBars = [
      new Progressbar(this, 'health', globalStateService, 50),
      new Progressbar(this, 'coin', globalStateService, 190),
      new Progressbar(this, 'potions', globalStateService, 120),
    ];
    this.enemies = [
      new Jellyfish(this, globalStateService),
      new Jellyfish(this, globalStateService),
      new Jellyfish(this, globalStateService),
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
    this.boss.preload();
  }

  create() {
    this.physics.world.setBounds(0, 0, 1920 * 2, 1080);
    this.background.create();
    this.createObjects(this.progressBars);
    this.setupPhysicsGroups();

    
    this.player.create();
    this.boss.create()

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
      this
        .handlePlayerEnemyCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );
    this.physics.add.overlap(
      this.player.playerSprite,
      this.objectsGroup,
      this
        .handlePlayerPotionCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );
    this.physics.add.overlap(
      this.boss.bossSprite,
      this.player.playerSprite,
      this.handlePlayerBossCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    )
  }

  handlePlayerEnemyCollision(
    player: Phaser.Types.Physics.Arcade.GameObjectWithBody, // kann eigentlich geloescht werden
    enemy: Phaser.Types.Physics.Arcade.GameObjectWithBody // kann eigentlich geloescht werden
  ) {
    if (this.player.damageCooldown) return;
    console.log('Kollision mit einem Gegner!'); 
    this.player.hasBeenHit(-1);
  }

  handlePlayerBossCollision() {
    if (this.player.damageCooldown) return;
    console.log('Kollision mit Boss!');
    this.boss.isAttacking = true;
    this.player.hasBeenHit(-2);
  }

  handlePlayerPotionCollision(
    player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    potion: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) {
    const hitObject = this.objects.find((p) => p.objectSprite === potion);
    if (hitObject instanceof Potions) {
      const index = this.findIndexFromArray(this.objects, hitObject);
      console.log('Kollision mitPotion!');
      hitObject.hasPickedUp = true;
      hitObject.objectSprite.destroy();
      this.deleteIndexFromArray(this.objects, index);
      this.globalStateService.modifyProgressbar('potions', 1);
    } else if (hitObject instanceof Coins) {
      const index = this.findIndexFromArray(this.objects, hitObject);
      console.log('Kollision mit Coin!');
      hitObject.hasPickedUp = true;
      hitObject.objectSprite.destroy();
      this.deleteIndexFromArray(this.objects, index);
      this.globalStateService.modifyProgressbar('coin', 1);
    }
    console.log(this.objects);
  }

  deleteIndexFromArray(array: any[], index: number) {
    array.splice(index, 1);
  }

  findIndexFromArray(array: any[], element: any) {
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
  }

  checkCollisions(objects: any) {
    objects.forEach((obj: any) => {
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
    if (distance < 500) {
      enemy.isAggro = true;
      enemy.checkAggroState();
    }
  }

  garbageCollection() {
    this.enemies.forEach((enemy, index) => {
      if (enemy.hasDied) {
        //console.log('Hier der Index', index);
        enemy.enemySprite.destroy();
        this.deleteIndexFromArray(this.enemies, index);
      }
    });
    if (this.boss.hasDied) {
      this.boss.bossSprite.destroy();
    }
  }

  poisonedBubbleCollisionCheck() {
    const bubbles = this.player.getPBubbles();
    bubbles.forEach((bubble) => {
        if (this.physics.overlap(bubble, this.boss.bossSprite)) {
          this.globalStateService.removePBubble(bubble);
          bubble.destroy();
          this.boss.healthPoints -= 25;
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
    // 1120 distance for spawn in boss
    //console.log('Distance to boss: ', distance);
    if (distance < 1120 && !this.boss.hasSpawned) {
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
      })
    });
  }
}
