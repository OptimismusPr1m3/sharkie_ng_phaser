import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import Phaser from 'phaser';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { GlobalstateserviceService } from '../../services/globalstate.service';
import { PhaserConfigService } from '../../services/phaser-config.service';
import { MatIconModule } from '@angular/material/icon';
import { InstructionsComponent } from '../landingpage/instructions/instructions.component';
import { SettingsComponent } from "../landingpage/settings/settings.component";

@Component({
  selector: 'app-game',
  imports: [CommonModule, NgxSpinnerComponent, MatIconModule, InstructionsComponent, SettingsComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  @ViewChild('phaserFrame', { static: true })
  phaserFrameElement!: ElementRef<HTMLDivElement>;

  game: Phaser.Game | undefined;
  isOverFHD: boolean = true;
  isMuted: boolean = false;
  isOverlayOpen: boolean = false;

  isControlsOpen: boolean = false;
  isSettingsOpen: boolean = false;

  // @HostListener('window:resize', ['$event'])
  // onResize() {
  //   this.resizeGame();
  // }

  // @HostListener('document:fullscreenchange', ['$event'])
  // onFullScreenChange() {
  //   this.resizeGame();
  // }

  constructor(
    private phaserConfigService: PhaserConfigService,
    private spinner: NgxSpinnerService,
    public globalStateService: GlobalstateserviceService
  ) {}

  ngOnInit() {
    if (window.innerWidth < 1920) {
      this.isOverFHD = false;
    }

    this.spinner.show();

    const config = this.phaserConfigService.getConfig();
    config.parent = this.phaserFrameElement.nativeElement;

    this.game = new Phaser.Game(config);

    this.game.events.once('scene-booted', () => {
      console.log('Scene booted!');
      this.spinner.hide();
    });

    setTimeout(() => {
      this.spinner.hide();
    }, 15000);
  }

  handleAudio() {
    this.isMuted = !this.isMuted;
    if (this.game) {
      //this.game.sound.mute = this.isMuted;
    }
  }

  isClosing() {
    this.isOverlayOpen = false;
    this.isControlsOpen = false;
    this.isSettingsOpen = false;
    this.game?.scene.resume('Gamescene');
  }

  openControls() {
    this.game?.scene.pause('Gamescene');
    this.isOverlayOpen = !this.isOverlayOpen;
    this.isControlsOpen = !this.isControlsOpen;
  }

  openSettings() {
    this.game?.scene.pause('Gamescene');
    this.isOverlayOpen = !this.isOverlayOpen;
    this.isSettingsOpen = !this.isSettingsOpen;
  }

  // handleFullScreen() {
  //   if (!this.game) return;

  //   if (this.game.scale.isFullscreen) {
  //     this.game.scale.stopFullscreen();
  //     this.game.scale.resize(1920, 1080);
  //   } else {
  //     this.game.scale.startFullscreen();
  //     setTimeout(() => {
  //       // Warte kurz, damit Phaser Zeit hat, sich anzupassen
  //       this.resizeGame();
  //     }, 100);
  //   }
  // }

  // resizeGame() {
  //   if (!this.game) return;

  //   const width = window.innerWidth;
  //   const height = window.innerHeight;

  //   this.game.scale.resize(width, height);
  //   this.game.canvas.style.width = `${width}px`;
  //   this.game.canvas.style.height = `${height}px`;
  // }
}
