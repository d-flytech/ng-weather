import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../services/weather-service';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { WeatherData } from '../models/weather-data.model';
import { getWeatherIcon, formatDate } from '../utils/weather-icon-date.utils';
import { cities } from '../utils/city-options.util';
import { CityOption } from '../models/city.model';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-widget',
  standalone: true,
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.css'],
  imports: [CommonModule, FormsModule],
})
export class WidgetComponent implements OnInit {
  private weatherService = inject(WeatherService);

  cities = cities;
  selectedCity: CityOption = cities[0];

  days$: Observable<
    { date: string; max: number; min: number; code: number }[]
  > = of([]);

  ngOnInit() {
    this.LoadWeather(this.selectedCity.lat, this.selectedCity.lon);
    console.log(
      'weather location coords:',
      this.selectedCity.lat,
      this.selectedCity.lon
    );
  }

  LoadWeather(lat: number | null, lon: number | null): void {
    if (lat === null || lon === null) {
      this.getUserLocation();
    } else {
      this.days$ = this.weatherService.getWeather(lat, lon).pipe(
        map((data: WeatherData) =>
          data.daily.time.map((date, i) => ({
            date: formatDate(date),
            max: Math.round(data.daily.temperature_2m_max[i]),
            min: Math.round(data.daily.temperature_2m_min[i]),
            code: data.daily.weathercode[i],
          }))
        )
      );
    }
  }

  getUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          console.log('Geoleocation: ', { lat, lon });

          this.LoadWeather(lat, lon);
        },
        (error) => {
          console.warn('Geolocation failed, loading default city', error);
          this.LoadWeather(52.37, 4.89);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    }
  }

  getIconPath(code: number): string {
    const iconName = getWeatherIcon(code);
    return `icons/${iconName}.ico`;
  }
}
