import { Directive, HostListener, Input, Renderer2, ElementRef, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[smokerButton]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SmokerButtonValueAccessorDirective),
      multi: true,
    },
  ],
})
export class SmokerButtonValueAccessorDirective implements ControlValueAccessor {
  @Input('smokerButton') value: string = '';

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private renderer: Renderer2, private elementRef: ElementRef) {}

  @HostListener('click')
  handleClick() {
    this.onChange(this.value);
    this.onTouched();
    this.renderer.addClass(this.elementRef.nativeElement, 'active');
  }

  // for styling through adding of class properties
  writeValue(value: any): void {
    if (value === this.value) {
      this.renderer.addClass(this.elementRef.nativeElement, 'active');
    } else {
      this.renderer.removeClass(this.elementRef.nativeElement, 'active');
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  }
}