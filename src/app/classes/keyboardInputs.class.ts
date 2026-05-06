import Phaser from 'phaser';
import { CustomKeys } from '../interfaces/CustomKeys.interface';
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';

export class KeyboardInputs {
  private keys!: CustomKeys; //the interface which extends the cursorkeyes type with new keys, i.e. slap and w_bubble etc..
  private scene: Phaser.Scene;
  private joystick!: any;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  initializeInputs() {
    this.keys = this.scene.input.keyboard?.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      slap: Phaser.Input.Keyboard.KeyCodes.F,
      w_bubble: Phaser.Input.Keyboard.KeyCodes.G,
    }) as CustomKeys;
    this.initializeVirtualJoystick();
    this.initializeMobileInputs();
  }

  initializeVirtualJoystick() {
    this.joystick = (
      this.scene.plugins.get('rexVirtualJoystick') as VirtualJoystickPlugin
    ).add(this.scene, {
      x: 150,
      y: this.scene.scale.height - 150,
      radius: 80,
      base: this.scene.add.circle(0, 0, 100, 0x444444),
      thumb: this.scene.add.circle(0, 0, 50, 0xf8edf9),
    });
    if (this.scene.sys.game.device.os.desktop) {
      this.joystick.base.setAlpha(0.0);
      this.joystick.thumb.setAlpha(0.0);
    } else {
      this.joystick.base.setAlpha(0.6);
      this.joystick.thumb.setAlpha(0.8);
    }
  }

  initializeMobileInputs() {
    this.createButton(this.scene.scale.width - 275, this.scene.scale.height - 175, 'Slap', this.keys.slap); // FIND SLAP
    this.createButton(this.scene.scale.width - 325, this.scene.scale.height - 100, 'Bubble', this.keys.w_bubble);
    this.createButton(this.scene.scale.width - 200, this.scene.scale.height - 100, 'Poison', this.keys.space)
  }
  createButton(x: number, y: number, text: string, key: Phaser.Input.Keyboard.Key) {
    const buttonWidth = 120, buttonHeight = 55, borderRadius = 20;
    const buttonBackground = this.scene.add.graphics();
    this.updateButtonBackground(buttonBackground, 0x444444, buttonWidth, buttonHeight, borderRadius);
  
    const buttonText = this.scene.add.text(0, 0, text, {
      fontSize: '28px',
      fontFamily: 'LGUY',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);
  
    const buttonContainer = this.scene.add.container(x, y, [buttonBackground, buttonText])
      .setSize(buttonWidth, buttonHeight)
      .setInteractive()
      .setScrollFactor(0)
      .setAlpha(this.scene.sys.game.device.os.desktop ? 0 : 0.8);
  
    buttonContainer.on('pointerdown', () => {
      (key as any).isDown = true;
      this.updateButtonBackground(buttonBackground, 0x666666, buttonWidth, buttonHeight, borderRadius);
    });
  
    buttonContainer.on('pointerup', () => {
      (key as any).isDown = false;
      this.updateButtonBackground(buttonBackground, 0x444444, buttonWidth, buttonHeight, borderRadius);
    });
  }
  
  updateButtonBackground(graphics: Phaser.GameObjects.Graphics, color: number, width: number, height: number, radius: number) {
    graphics.clear();
    graphics.fillStyle(color, 1);
    graphics.fillRoundedRect(-width / 2, -height / 2, width, height, radius);
  }
  


  getCursorKeys(): CustomKeys {
    return this.keys;
  }

  getJoystick() {
    return {
      left: this.joystick.left,
      right: this.joystick.right,
      up: this.joystick.up,
      down: this.joystick.down,
    };
  }
}
