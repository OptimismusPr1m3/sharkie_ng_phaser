import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import Phaser from 'phaser';
import { Gamescene } from '../../scenes/gamescene';

@Component({
  selector: 'app-game',
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {

  @ViewChild('phaserFrame', {static: true}) phaserFrameElement!: ElementRef<HTMLDivElement>;

  game: Phaser.Game | undefined
  isOverFHD: boolean = true

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth < 1920) {
      this.isOverFHD = false
    }
  }

  ngOnInit() {
    if (window.innerWidth < 1920) {
      this.isOverFHD = false
    }
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1920,
      height: 1080,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        max: {
          width: 1920,
          height: 1080
      },
      },
      physics: {
        default: 'arcade',
        arcade: {
          debug: true,
        },
      },
      parent: this.phaserFrameElement.nativeElement,
      scene: [Gamescene]
    }

    this.game = new Phaser.Game(config)
  }

}
