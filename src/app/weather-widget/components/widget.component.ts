import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../services/weather-service';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { WeatherData } from '../models/weather-data.model';
import { getWeatherIcon } from '../utils/weather-icon.util';

@Component({
  selector: 'app-widget',
  standalone: true,
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.css'],
  imports: [CommonModule],
})

export class WidgetComponent implements OnInit {
  private weatherService = inject(WeatherService);

  days$: Observable<
    { date: string; max: number; min: number; code: number }[]
  > = of([]);

  ngOnInit() {
    const lat = 52.37;
    const lon = 4.89;

    console.log("weather location coords:", lat , lon);

    this.days$ = this.weatherService.getWeather(lat, lon).pipe(
      map((data: WeatherData) =>
        data.daily.time.map((date, i) => ({
          date,
          max: data.daily.temperature_2m_max[i],
          min: data.daily.temperature_2m_min[i],
          code: data.daily.weathercode[i],          
        }))
      )
    );
  }
  getIconPath(code: number): string {
    const iconName = getWeatherIcon(code);
    return `icons/${iconName}.ico`;
  }
}
