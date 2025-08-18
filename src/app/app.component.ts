import { Component } from '@angular/core';
import { WidgetComponent } from './weather-widget/components/widget.component';
import { FormsModule} from '@angular/forms';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [WidgetComponent, FormsModule],
  template: `<app-widget></app-widget>`
})

export class AppComponent {
}
