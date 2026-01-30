import { WeatherService } from './weather-service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';


describe('WeatherService', () => {
    let service: WeatherService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ WeatherService],
        });

        service = TestBed.inject(WeatherService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('Should fetch weather data for a city', () => {
        const MockResponse = {
            daily: {
                temperature_2m_max: [15, 14],
                temperature_2m_min: [10, 9],
                weather_code:[61, 63],
                time:['2025-10-21', '2025-10-22']
            }
        }

        service.getWeather(52.37, 4.89).subscribe(data => {
            expect(data.daily.temperature_2m_max.length).toBe(2);
            expect(data.daily.temperature_2m_max[0]).toBe(15);
            expect(data.daily.weather_code[0]).toBe(61);
        });

        const req = httpMock.expectOne(req =>
            req.url.includes('open-meteo.com') && req.method === 'GET'
        );
        req.flush(MockResponse);

    });

});