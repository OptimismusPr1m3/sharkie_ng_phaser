import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { KeyComponent } from "../../../shared/key/key.component";
import { MatIconModule } from '@angular/material/icon';;


@Component({
  selector: 'app-instructions',
  imports: [CommonModule, KeyComponent, MatIconModule],
  templateUrl: './instructions.component.html',
  styleUrl: './instructions.component.scss'
})
export class InstructionsComponent {

  isClosing = output();
  isFirstPage: boolean = true;

  closeInstruction() {
    this.isClosing.emit()
  }

  navigateTo(isFirstPage: boolean){
    this.isFirstPage = isFirstPage ? true : false
    console.log(this.isFirstPage)
  }

}
