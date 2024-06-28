import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class TooltipDirective implements OnInit, OnDestroy {

  @Input('appTooltip') tooltipTitle: string = '';
  tooltip: HTMLElement = {} as HTMLElement;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    this.createTooltip();
  }

  ngOnDestroy() {
    this.destroyTooltip();
  }

  createTooltip() {

    if (!this.tooltip || typeof (this.tooltip) === null) return;

    this.tooltip = this.renderer.createElement('span');
    this.tooltip.innerText = this.tooltipTitle;
    this.renderer.appendChild(document.body, this.tooltip);
    this.renderer.setStyle(this.tooltip, 'position', 'absolute');
    this.renderer.setStyle(this.tooltip, 'backgroundColor', 'red');
    this.renderer.setStyle(this.tooltip, 'color', 'white');
    this.renderer.setStyle(this.tooltip, 'padding', '5px 10px');
    this.renderer.setStyle(this.tooltip, 'borderRadius', '5px');
    this.renderer.setStyle(this.tooltip, 'fontSize', '12px');
    this.renderer.setStyle(this.tooltip, 'zIndex', '1000');
    this.renderer.setStyle(this.tooltip, 'white-space', 'nowrap');

    this.setPosition();
  }

  setPosition() {
    const hostPos = this.el.nativeElement.getBoundingClientRect();
    const tooltipPos = this.tooltip.getBoundingClientRect();

    const top = hostPos.top + (hostPos.height / 2) - (tooltipPos.height / 2);
    const left = hostPos.left - tooltipPos.width - 10;

    this.renderer.setStyle(this.tooltip, 'top', `${top}px`);
    this.renderer.setStyle(this.tooltip, 'left', `${left}px`);
  }

  destroyTooltip() {
    if (this.tooltip) {
      this.renderer.removeChild(document.body, this.tooltip);
      this.tooltip = {} as HTMLElement;
    }
  }

}
