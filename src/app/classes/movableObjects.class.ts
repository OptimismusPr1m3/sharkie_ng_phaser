import Phaser from 'phaser';

export class MovableObjects {
  scene: Phaser.Scene;

  healthPoints: number = 100;
  height!: number;
  width!: number;
  offsetX!: number;
  offsetY!: number;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
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
    sprite.flipX = direction; //true = left, false = right
    sprite.anims.play(animation, true);
  }

  moveY(
    sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    speed: number,
    animation: string,
  ) {
    sprite.setVelocityY(speed);
    sprite.anims.play(animation, true);
  }

  attackAnimation( sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, animation: string) {
    sprite.anims.play(animation, true);
  }

  idle(sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, animation: string) {
    sprite.setVelocityX(0);
    sprite.setVelocityY(0);
    sprite.anims.play(animation, true);
  }

}
