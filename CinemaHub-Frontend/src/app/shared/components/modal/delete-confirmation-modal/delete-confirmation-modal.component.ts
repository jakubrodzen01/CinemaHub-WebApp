import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-delete-confirmation-modal',
  templateUrl: './delete-confirmation-modal.component.html',
  styleUrls: ['./delete-confirmation-modal.component.css']
})
export class DeleteConfirmationModalComponent {
  @Output() confirmed = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  confirm() {
    this.confirmed.emit();
    this.onClose();
  }

  onClose() {
    this.close.emit();
  }
}
