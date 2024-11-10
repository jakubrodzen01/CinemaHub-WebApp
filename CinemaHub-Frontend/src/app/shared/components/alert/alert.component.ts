import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  @Input() errorMessage!:string;
  @Output() clearMessage = new EventEmitter<void>();
  @Input() showButton = false;

  clearErrorMessage() {
    this.clearMessage.emit();
  }
}
