import { CommonModule } from '@angular/common';
import { Component, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { KeyComponent } from '../../../shared/key/key.component';

@Component({
  selector: 'app-manual',
  imports: [CommonModule, MatIconModule, KeyComponent],
  templateUrl: './manual.component.html',
  styleUrl: './manual.component.scss'
})
export class ManualComponent {

    isClosing = output();
    navigatedSite: number = 0;
  
    closeManual() {
      this.isClosing.emit()
    }

    navigateSite(direction: number) {
      this.navigatedSite += direction;
    }
}

