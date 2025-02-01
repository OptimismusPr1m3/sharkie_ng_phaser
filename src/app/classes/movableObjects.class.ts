import Phaser from 'phaser';
import { GlobalstateserviceService } from '../services/globalstate.service';

export class MovableObjects {
  scene: Phaser.Scene;
  isAttacking: boolean = false;
  attackKeyPressed: boolean = false;
  healthPoints: number = 100;
  height!: number;
  width!: number;
  offsetX!: number;
  offsetY!: number;
  posX!: number;
  posY!: number;
  speed!: number;
  isDead: boolean = false;
  hasDied: boolean = false;
  frameRate!: number;
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

  moveX(
    sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    speed: number,
    animation: string,
    direction: boolean
  ) {
    sprite.setVelocityX(speed);
    sprite.setVelocityY(0);
    sprite.flipX = direction; //true = left, false = right
    sprite.anims.play(animation, true);
  }

  moveY(
    sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    speed: number,
    animation: string
  ) {
    sprite.setVelocityY(speed);
    sprite.setVelocityX(0);
    sprite.anims.play(animation, true);
  }

  attackAnimation(
    sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    animation: string,
    idleAnimation: string
  ) {
    if (this.isAttacking) return;
    sprite.setVelocity(0);
    this.isAttacking = true;
    sprite.anims.play(animation).once('animationcomplete', () => {
      this.globalStates.hasSlapped.set(true);
      this.isAttacking = false;
      console.log('attack complete');
      this.attackKeyPressed = false;
    });
  }

  idle(
    sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    animation: string
  ) {
    sprite.setVelocityX(0);
    sprite.setVelocityY(0);
    sprite.anims.play(animation, true);
  }

  randomizePosition(min: number, max:number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getChosenJellyFish(chosenFish: string, textureString1: string, textureString2: string): string {
    return chosenFish === 'lila' ? textureString1 : textureString2;
  }

}
