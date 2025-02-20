import { CommonModule } from '@angular/common';
import { Component, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { KeyComponent } from '../../../shared/key/key.component';

@Component({
  selector: 'app-manual',
  imports: [CommonModule, MatIconModule],
  templateUrl: './manual.component.html',
  styleUrl: './manual.component.scss'
})
export class ManualComponent {

    isClosing = output();
    isFirstPage: boolean = true;
  
    closeManual() {
      this.isClosing.emit()
    }
  
    navigateTo(isFirstPage: boolean){
      this.isFirstPage = isFirstPage ? true : false
      console.log(this.isFirstPage)
    }

}

