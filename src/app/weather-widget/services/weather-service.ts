import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { WeatherData } from  "../models/weather-data.model";

@Injectable({providedIn: 'root'})
export class WeatherService {
constructor(private http: HttpClient) { }

getWeather(lat:number, lon:number): Observable <WeatherData> {

    const API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Europe/Amsterdam`;
    return this.http.get<WeatherData>(API_URL);
}
};
