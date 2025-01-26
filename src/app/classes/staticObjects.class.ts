import Phaser from 'phaser';
import { GlobalstateserviceService } from '../services/globalstate.service';

export class StaticObjects {
  scene: Phaser.Scene;
  imageCenter: number = 1920 / 2;
  posX!: number;
  posY!: number;
  objectSprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  globalStates: GlobalstateserviceService;

  constructor(scene: Phaser.Scene, globalStates: GlobalstateserviceService) {
    this.scene = scene;
    this.globalStates = globalStates;
  }

  loadImages(amount: number, key: string, path: string) {
    for (let i = 1; i < amount; i++) {
      this.scene.load.image(key + i, `${path}${i}.png`);
    }
  }

  getSpriteImages(keyString: string, amount: number): { key: string }[] {
    const keyFrames = [];
    for (let i = 1; i < amount; i++) {
      keyFrames.push({ key: keyString + i });
    }
    return keyFrames;
  }

  idle(
    sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    animation: string
  ) {
    sprite.setVelocityX(0);
    sprite.setVelocityY(0);
    sprite.anims.play(animation, true);
  }

  randomizePosition(min:number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
