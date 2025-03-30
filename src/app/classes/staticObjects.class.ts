import Phaser from 'phaser';
import { GlobalstateserviceService } from '../services/globalstate.service';

export class StaticObjects {
  scene: Phaser.Scene;
  hasPickedUp: boolean = false;
  imageCenter: number = 1920 / 2;
  posX!: number;
  posY!: number;
  objectSprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  globalStates: GlobalstateserviceService;
  rndNumber!: number;

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

  randomizePositions(min: number, max: number, pos: string): number {
    this.rndNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    const randomPositions = pos === 'X' ? this.globalStates.randomizedPostionsX() : this.globalStates.randomizedPostionsY();
    //console.log(`Random Positions${pos}:`, randomPositions);
    while (randomPositions.includes(this.rndNumber)) {
      this.rndNumber += 155;
    }
    randomPositions.push(this.rndNumber);
    if (pos === 'X') {
      this.globalStates.randomizedPostionsX.set(randomPositions);
    } else {
      this.globalStates.randomizedPostionsY.set(randomPositions);
    }
    return this.rndNumber;
  }

}
