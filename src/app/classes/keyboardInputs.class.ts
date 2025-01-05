import Phaser from 'phaser';
import { CustomKeys } from '../interfaces/CustomKeys.interface';

export class KeyboardInputs {
  private keys!: CustomKeys; //the interface which extends the cursorkeyes type with new keys, i.e. slap and w_bubble etc..
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  

  initializeInputs() {
    this.keys =
      (this.scene.input.keyboard?.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        space: Phaser.Input.Keyboard.KeyCodes.SPACE,
        slap: Phaser.Input.Keyboard.KeyCodes.F,
        w_bubble: Phaser.Input.Keyboard.KeyCodes.G,
      }) as CustomKeys);
  }

  getCursorKeys(): CustomKeys {
    return this.keys;
  }
}
