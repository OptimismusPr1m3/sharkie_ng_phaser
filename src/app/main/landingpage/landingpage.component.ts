import { Component } from '@angular/core';
import { GameComponent } from "../game/game.component";
import { CommonModule } from '@angular/common';
import { InstructionsComponent } from "./instructions/instructions.component";
import { ManualComponent } from "./manual/manual.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landingpage',
  imports: [GameComponent, CommonModule, InstructionsComponent, ManualComponent, RouterLink],
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.scss'
})
export class LandingpageComponent {

  isPlayGamePressed: boolean = false;
  isInstructionsPressed: boolean = false;
  isManual: boolean = false
  isChoosing: boolean = true;

  startGame() {
    this.isChoosing = !this.isChoosing
    this.isPlayGamePressed = !this.isPlayGamePressed
  }

  openInstructions() {
    this.isChoosing = !this.isChoosing
    this.isManual = false;
  }

  handleClosing(event: any) {
    this.isChoosing = !this.isChoosing
  }

  openManual() {
    this.isChoosing = !this.isChoosing
    this.isManual = !this.isChoosing
  }

}
