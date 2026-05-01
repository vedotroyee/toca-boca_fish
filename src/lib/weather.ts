export type WeatherState = 'Sunny' | 'Cloudy' | 'Rainy' | 'Thunderstorm' | 'Snowy' | 'Foggy' | 'Windy' | 'Hot' | 'Night';

export interface WeatherData {
  state: WeatherState;
  temp: number;
  city: string;
  icon: string;
  isReal: boolean;
}

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || '';

export const fetchWeatherByCoords = async (lat: number, lon: number): Promise<WeatherData | null> => {
  if (!API_KEY) {
      console.warn("No OpenWeatherMap API key found in .env");
      return null;
  }
  
  try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
      if (!res.ok) throw new Error('Weather fetch failed');
      const data = await res.json();
      return processWeatherData(data, true);
  } catch (err) {
      console.error(err);
      return null;
  }
};

export const geocodeCity = async (cityName: string) => {
    if (!API_KEY) return null;
    try {
        const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${API_KEY}`);
        if (!res.ok) throw new Error('Geocoding failed');
        const data = await res.json();
        return data;
    } catch (err) {
        console.error(err);
        return null;
    }
};

export const fetchWeatherByCity = async (cityName: string): Promise<WeatherData | null> => {
    if (!API_KEY) return null;
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`);
        if (!res.ok) throw new Error('Weather fetch failed');
        const data = await res.json();
        return processWeatherData(data, false);
    } catch (err) {
        console.error(err);
        return null;
    }
}

const processWeatherData = (data: any, isReal: boolean): WeatherData => {
    const id = data.weather[0].id;
    const icon = data.weather[0].icon;
    const temp = Math.round(data.main.temp);
    const windSpeed = data.wind.speed;
    const city = data.name;

    let state: WeatherState = 'Sunny';

    // Map OWM Codes to our states
    if (temp > 38) {
        state = 'Hot';
    } else if (id >= 200 && id < 300) {
        state = 'Thunderstorm';
    } else if (id >= 300 && id < 600) {
        state = 'Rainy';
    } else if (id >= 600 && id < 700) {
        state = 'Snowy';
    } else if (id >= 700 && id < 800) {
        state = 'Foggy';
    } else if (id === 800) {
        if (icon.includes('n')) {
            state = 'Night';
        } else {
            state = 'Sunny';
        }
    } else if (id > 800) {
        if (icon.includes('n')) {
             state = 'Night'; // Could be cloudy night, but user specified Night + Clear. Let's make all nights Night or Cloudy Night.
             // Actually user said Night + Clear -> Night. Let's just use Cloudy for cloudy nights.
             if (id > 802) state = 'Cloudy';
             else state = 'Night';
        } else {
             state = 'Cloudy';
        }
    }

    if (windSpeed > 10 && state !== 'Thunderstorm' && state !== 'Rainy') {
        state = 'Windy'; // Override if very windy and not raining
    }

    return {
        state,
        temp,
        city,
        icon,
        isReal
    };
};
