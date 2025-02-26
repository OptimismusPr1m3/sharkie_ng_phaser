import { CommonModule } from '@angular/common';
import { Component, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { GlobalstateserviceService } from '../../../services/globalstate.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, MatIconModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

  isClosing = output();

  constructor(private globalStateService: GlobalstateserviceService) {}

  close() {
    this.isClosing.emit()
  }

  toggleFPS() {
    this.globalStateService.isShowingFPS.set(!this.globalStateService.isShowingFPS());
    this.close();
  }

  reload() {
    window.location.reload();
  }

}
