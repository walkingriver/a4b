import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
@Component({
  selector: 'app-my-checkbox',
  templateUrl: './my-checkbox.component.html',
  styleUrls: ['./my-checkbox.component.css'],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MyCheckboxComponent),
      multi: true,
    },
  ],
})
export class MyCheckboxComponent implements ControlValueAccessor {
  // Bindable properties
  @Input() text = '';
  @Input() disabled = false;

  // Internal properties
  isChecked = false;

  onChange = (_: unknown) => {};
  onBlur = (_: unknown) => {};

  writeValue(obj: boolean): void {
    this.isChecked = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onBlur = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onChanged($event: Event) {
    const isChecked = ($event.target as HTMLInputElement)?.checked;
    this.isChecked = isChecked;
    this.onChange(isChecked);
  }
}
