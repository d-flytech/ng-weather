export function getWeatherIcon(code: number): string {
if (code === 0) return 'sun';
if ([1, 2, 3].includes(code)) return 'cloudy';
if ([51, 53, 55, 61, 63, 65, 80, 81, 82, 95].includes(code)) return 'rain';
return 'unknown';
}
