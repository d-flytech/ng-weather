import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../services/weather-service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { WeatherData } from '../models/weather-data.model';
import { getWeatherIcon, formatDate } from '../utils/weather-icon-date.utils';
import { cities } from '../data/cities';
import { CityOption } from '../models/city.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-widget',
  standalone: true,
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.css'],
  imports: [CommonModule, FormsModule],
})
export class WidgetComponent {
  private weatherService = inject(WeatherService);

  cities = cities;
  // use of signal instead of observable
  selectedCity = signal<CityOption>(cities[0]);

  //signal-help
  private coords = computed(() => {
    const city = this.selectedCity();
    return { lat: city.lat, lon: city.lon };
  });

  // use of toSignal -> toObservable
  days = toSignal(
    toObservable(this.coords).pipe(
      switchMap(({ lat, lon }: { lat: number | null; lon: number | null }) => {
        if (lat === null || lon === null) {
          return of([]);
        }

        return this.weatherService.getWeather(lat, lon).pipe(
          map((data: WeatherData) =>
            data.daily.time.map((date, i) => ({
              date: formatDate(date),
              max: Math.round(data.daily.temperature_2m_max[i]),
              min: Math.round(data.daily.temperature_2m_min[i]),
              code: data.daily?.weather_code?.[i] ?? -1,
            })),
          ),
          catchError((err) => {
            console.error('Weather api failed', err);
            return of([]);
          }),
        );
      }),
    ),
    { initialValue: [] },
  );

  getUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          console.log('Geoleocation: ', { lat, lon });

          const geoCity: CityOption = {
            name: 'Your Location',
            lat: lat,
            lon: lon,
          };
          this.selectedCity.set(geoCity);
        },
        (error) => {
          console.warn('Geolocation failed, loading default city', error);
          this.selectedCity.set(cities[0]);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        },
      );
    }
  }

  getIconPath(code: number): string {
    const iconName = getWeatherIcon(code);
    return `icons/${iconName}.ico`;
  }
}
