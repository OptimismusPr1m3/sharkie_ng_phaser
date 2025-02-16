import { Component } from '@angular/core';
import { GameComponent } from "../game/game.component";
import { CommonModule } from '@angular/common';
import { InstructionsComponent } from "./instructions/instructions.component";

@Component({
  selector: 'app-landingpage',
  imports: [GameComponent, CommonModule, InstructionsComponent],
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.scss'
})
export class LandingpageComponent {

  isPlayGamePressed: boolean = false;
  isInstructionsPressed: boolean = false;
  isChoosing: boolean = true;

  startGame() {
    this.isChoosing = !this.isChoosing
    this.isPlayGamePressed = !this.isPlayGamePressed
  }

  openInstructions() {
    this.isChoosing = !this.isChoosing
  }

  handleClosing(event: any) {
    this.isChoosing = !this.isChoosing
  }

}
