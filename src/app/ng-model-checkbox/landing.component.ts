import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyCheckboxComponent } from './my-checkbox/my-checkbox.component';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, MyCheckboxComponent],
  template: `
    <h1>Custom Checkbox</h1>
    <h2>with [(ngModel)] support</h2>
    <p></p>
    <app-my-checkbox
      [(ngModel)]="isChecked"
      [text]="text"
      [disabled]="isDisabled"
    />
    The checkbox is {{ isChecked ? 'checked' : 'unchecked' }} and is
    {{ isDisabled ? 'disabled' : 'enabled' }}.
    <hr />
    <app-my-checkbox
      [(ngModel)]="isDisabled"
      text="Disable the other checkbox"
    />
  `,
  styles: [],
})
export class LandingComponent {
  isChecked = true;
  text = 'Check the box!';
  isDisabled = true;
}
