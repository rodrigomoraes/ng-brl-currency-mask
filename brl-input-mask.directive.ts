import {
  Directive,
  ElementRef,
  HostListener,
  Output,
  EventEmitter,
} from '@angular/core';

@Directive({
  selector: '[brlMask]',
})
export class BrlMaskDirective {
  @Output() brlMaskValue: EventEmitter<number> = new EventEmitter<number>();

  private isInitialInput: boolean = true;

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: any) {
    const value = event.target.value;
    const cleanValue = this.getCleanValue(value);
    const maskedValue = this.getMaskedValue(cleanValue);
    this.el.nativeElement.value = maskedValue;

    if (!this.isInitialInput) {
      const numericValue = this.parseNumericValue(cleanValue);
      this.brlMaskValue.emit(numericValue);
    } else {
      this.isInitialInput = false;
    }
  }

  @HostListener('change', ['$event'])
  onChange(event: any) {
    const value = event.target.value;
    const cleanValue = this.getCleanValue(value);
    const maskedValue = this.getMaskedValue(cleanValue);
    event.target.value = maskedValue;

    const numericValue = this.parseNumericValue(cleanValue);
    this.brlMaskValue.emit(numericValue);
  }

  ngAfterViewInit() {
    const value = this.el.nativeElement.value;
    const cleanValue = this.getCleanValue(value);
    const maskedValue = this.getMaskedValue(cleanValue);
    this.el.nativeElement.value = maskedValue;

    const numericValue = this.parseNumericValue(cleanValue);
    this.brlMaskValue.emit(numericValue);
  }

  private getCleanValue(value: string): string {
    return value.replace(/[^0-9]/g, '');
  }

  private getMaskedValue(cleanValue: string): string {
    if (cleanValue.length === 0 || cleanValue === '0') {
      return '0,00';
    }
    if (cleanValue.length <= 2) {
      const integer = cleanValue.padStart(2, '0').replace(/^0*/, '');
      return `0,${integer}`;
    }

    const cents = cleanValue.substr(-2);
    const integer = cleanValue.slice(0, -2).replace(/^0+/, '');
    if (integer === '') {
      return `0,${cents}`;
    }
    return `${this.addThousandSeparator(integer)},${cents}`;
  }

  private addThousandSeparator(value: string): string {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  private parseNumericValue(value: string): number {
    return parseFloat(value) / 100;
  }
}
