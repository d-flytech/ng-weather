import { Component } from '@angular/core';
import { WidgetComponent } from './widget.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [WidgetComponent],
  template: `<app-widget></app-widget>`
})
export class AppComponent {}
