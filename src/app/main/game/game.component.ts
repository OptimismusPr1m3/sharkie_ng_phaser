import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, output, ViewChild } from '@angular/core';
import Phaser from 'phaser';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { GlobalstateserviceService } from '../../services/globalstate.service';
import { PhaserConfigService } from '../../services/phaser-config.service';
import { MatIconModule } from '@angular/material/icon';
import { InstructionsComponent } from '../landingpage/instructions/instructions.component';
import { SettingsComponent } from '../landingpage/settings/settings.component';
import { WinLoseComponent } from '../../shared/win-lose/win-lose.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  imports: [
    CommonModule,
    NgxSpinnerComponent,
    MatIconModule,
    InstructionsComponent,
    SettingsComponent,
    WinLoseComponent
  ],
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

  @HostListener('document:fullscreenchange', ['$event'])
  onFullScreenChange() {
    if (this.game) {
      //const parent = this.phaserFrameElement.nativeElement;
      this.game.scale.refresh();
    }
  }

  // @HostListener('document:fullscreenchange', ['$event'])
  // onFullScreenChange() {
  //   this.resizeGame();
  // }

  constructor(
    private phaserConfigService: PhaserConfigService,
    private spinner: NgxSpinnerService,
    public globalStateService: GlobalstateserviceService,
    private router: Router,
  ) {}

  ngOnInit() {
    if (window.innerWidth < 1920) {
      this.isOverFHD = false;
    }
    this.startGame();
  }

  handlePause() {
    this.game?.scene.pause('Gamescene');
  }

  startGame() {
    this.spinner.show();

    const config = this.phaserConfigService.getConfig();
    config.parent = this.phaserFrameElement.nativeElement;

    this.game = new Phaser.Game(config);

    this.game.events.once('scene-booted', () => {
      console.log('Scene booted!');
      if (window.innerHeight < 600) {
        this.handleFullScreen();
      }
      this.spinner.hide();
    });

    setTimeout(() => {
      this.spinner.hide();
    }, 15000);
  }

  // handleRestart() {
  //   this.globalStateService.restart();
  //   this.game?.destroy(false, false);
  //   this.startGame()
  //   console.log('winLoseState: ',this.globalStateService.isWinLoseScreen());
  // }


  handleRestart() {
    const queryParams = {isRestarting: true};
    this.router.navigate(['/'], { queryParams }).then(() => {
      window.location.reload();
    });
  }


  handleHome() {
    window.location.reload();
  }

  handleAudio() {
    this.isMuted = !this.isMuted;
    if (this.game && this.isMuted) {
      this.game.sound.pauseAll();
    } else { this.game?.sound.resumeAll();}
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

  handleFullScreen() {
    if (this.phaserFrameElement) {
      const element = this.phaserFrameElement.nativeElement;
      if (!document.fullscreenElement) {
        this.globalStateService.isFullScreen.set(true)
        element.requestFullscreen().catch((err) => {
          console.error('Fehler beim Aktivieren des Fullscreen-Modus:', err);
        });
      } else {
        this.globalStateService.isFullScreen.set(false)
        document.exitFullscreen().catch((err) => {
          console.error('Fehler beim Verlassen des Fullscreen-Modus:', err);
        });
      }
    }
  }
}
