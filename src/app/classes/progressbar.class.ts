import { GlobalstateserviceService } from '../services/globalstate.service';
import { StaticObjects } from './staticObjects.class';

export class Progressbar extends StaticObjects {
  private potionBarSprites: string[] = [
    'assets/bars/potion_bar/0_1.png',
    'assets/bars/potion_bar/20_2.png',
    'assets/bars/potion_bar/40_3.png',
    'assets/bars/potion_bar/60_4.png',
    'assets/bars/potion_bar/80_5.png',
    'assets/bars/potion_bar/100_6.png',
  ];

  private coinBarSprites: string[] = [
    'assets/bars/coin_bar/0_1.png',
    'assets/bars/coin_bar/20_2.png',
    'assets/bars/coin_bar/40_3.png',
    'assets/bars/coin_bar/60_4.png',
    'assets/bars/coin_bar/80_5.png',
    'assets/bars/coin_bar/100_6.png',
  ];

  private healthBarSprites: string[] = [
    'assets/bars/life_bar/0_1.png',
    'assets/bars/life_bar/20_2.png',
    'assets/bars/life_bar/40_3.png',
    'assets/bars/life_bar/60_4.png',
    'assets/bars/life_bar/80_5.png',
    'assets/bars/life_bar/100_6.png',
  ];

  barName!: string;

  private currentBar!: string[];
  progressBar!: Phaser.GameObjects.Image;

  constructor(
    scene: Phaser.Scene,
    bar: string,
    globalStates: GlobalstateserviceService,
    posY: number
  ) {
    super(scene, globalStates);
    this.setBar(bar);
    this.posY = posY;
    this.barName = bar;
  }

  setBar(bar: string) {
    switch (bar) {
      case 'potions':
        this.currentBar = this.potionBarSprites;
        break;
      case 'coin':
        this.currentBar = this.coinBarSprites;
        break;
      case 'health':
        this.currentBar = this.healthBarSprites;
        break;
      default:
        break;
    }
  }

  preload() {
    this.currentBar.forEach((sprite, index) => {
      this.scene.load.image(`${this.barName}${index + 1}`, sprite);
    });
  }

  create() {
    this.progressBar = this.scene.add
      .image(200, this.posY, `${this.barName}1`)
      .setScale(0.6);
    this.progressBar.setScrollFactor(0);
    this.progressBar.setDepth(1);
  }

  update() {
    this.setTextures(this.barName)
  }

  setTextures(bar: string) {
    switch (bar) {
      case 'potions':
        const barIndex = this.globalStates.currentPotions();
        this.progressBar.setTexture(`${this.barName}${barIndex}`);
        break;
      case 'coin':
        const coinIndex = this.globalStates.currentCoins();
        this.progressBar.setTexture(`${this.barName}${coinIndex}`);
        break;
      case 'health':
        const healthIndex = this.globalStates.currentHealth();
        this.progressBar.setTexture(`${this.barName}${healthIndex}`);
        break;
    }
  }
}
