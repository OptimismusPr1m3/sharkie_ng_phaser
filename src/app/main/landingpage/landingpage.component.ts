import { Component, HostListener } from '@angular/core';
import { GameComponent } from '../game/game.component';
import { CommonModule } from '@angular/common';
import { InstructionsComponent } from './instructions/instructions.component';
import { ManualComponent } from './manual/manual.component';
import { RouterLink } from '@angular/router';
import { GlobalstateserviceService } from '../../services/globalstate.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
@Component({
  selector: 'app-landingpage',
  imports: [
    GameComponent,
    CommonModule,
    InstructionsComponent,
    ManualComponent,
    RouterLink,
  ],
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.scss',
  animations: [
    trigger('rotate', [
      state('zero', style({ transform: 'rotate(0deg)' })),
      state('ninety', style({ transform: 'rotate(90deg)' })),
      transition(':enter', [
        style({ transform: 'rotate(0deg)' }),
        animate('500ms ease-in-out', style({ transform: 'rotate(90deg)' })),
        animate('500ms ease-in-out', style({ transform: 'rotate(0deg)' })),
      ]),
      transition('zero <=> ninety', [animate('500ms ease-in-out')]),
    ]),
  ],
})
export class LandingpageComponent {
  isPlayGamePressed: boolean = false;
  isInstructionsPressed: boolean = false;
  isManual: boolean = false;
  isChoosing: boolean = true;
  currentHeight!: number;
  isInvis: boolean = false;
  minWidth: number = 768;
  isMobilePortrait: boolean = false;
  rotationState: string = 'zero';

  constructor(public globalStateService: GlobalstateserviceService) {
    this.currentHeight = window.innerHeight;
    this.checkInvis(window.innerHeight);
    this.checkScreenSize(window.innerWidth, window.innerHeight);
    this.startRotation();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.currentHeight = event.target.innerHeight;
    this.checkInvis(event.target.innerHeight);
    this.checkScreenSize(event.target.innerWidth, event.target.innerHeight);
  }

  startRotation() {
    setInterval(() => {
      this.rotationState = this.rotationState === 'zero' ? 'ninety' : 'zero';
    }, 2000); // Wechselt alle 1000ms (500ms pro Animation)
  }

  checkScreenSize(width: number, height: number) {
    const isPortrait = width < height;
    this.isMobilePortrait = width < this.minWidth && isPortrait;
  }

  checkInvis(height: number) {
    if (height < 1080) {
      this.isInvis = true;
    } else {
      this.isInvis = false;
    }
  }

  startGame() {
    this.isChoosing = !this.isChoosing;
    this.isPlayGamePressed = !this.isPlayGamePressed;
  }

  openInstructions() {
    this.isChoosing = !this.isChoosing;
    this.isManual = false;
  }

  handleClosing(event: any) {
    this.isChoosing = !this.isChoosing;
  }

  openManual() {
    this.isChoosing = !this.isChoosing;
    this.isManual = !this.isChoosing;
  }
}
