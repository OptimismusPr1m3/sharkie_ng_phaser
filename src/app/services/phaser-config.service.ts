import { Injectable } from '@angular/core';
import Phaser from 'phaser';
import { GlobalstateserviceService } from './globalstate.service';
import { Gamescene } from '../scenes/gamescene';

@Injectable({
  providedIn: 'root',
})
export class PhaserConfigService {
  private phaserConfig!: Phaser.Types.Core.GameConfig;

  constructor(private globalStateService: GlobalstateserviceService) {}

  initializeConfig() {
    if (!this.phaserConfig) {
      this.phaserConfig = {
        type: Phaser.AUTO,
        width: 1920,
        height: 1080,
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,

        },
        physics: {
          default: 'arcade',
          arcade: {
            debug: true,
          },
        },
        parent: null,
        scene: [new Gamescene(this.globalStateService)],
      };
    }
  }

  getConfig() {
    return this.phaserConfig;
  }

}
