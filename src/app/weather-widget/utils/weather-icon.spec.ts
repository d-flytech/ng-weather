import { getWeatherIcon } from './weather-icon-date.utils';

describe('getWeatherIcon', () => {
  it("It returns 'sun' for code 0 ", () => {
    expect(getWeatherIcon(0)).toBe('sun');
  });

  it("returns 'cloudy' for codes 1,2,3", () => {
    expect(getWeatherIcon(1)).toBe('cloudy');
    expect(getWeatherIcon(2)).toBe('cloudy');
    expect(getWeatherIcon(3)).toBe('cloudy');
  });

  it("returns 'rain' for unknown raincodes", () => {
    const rainCodes = [51, 53, 55, 61, 63, 65, 80, 81, 82, 95];
    rainCodes.forEach((code) => {
      expect(getWeatherIcon(code)).toBe('rain');
    });
  });

  it("returns 'unknown' for unrecognized codes", () => {
    expect(getWeatherIcon(999)).toBe('unknown-weather');
    expect(getWeatherIcon(-1)).toBe('unknown-weather');
  });
});
