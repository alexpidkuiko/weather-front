export interface ICoord {
  lon: number;
  lat: number;
}

export interface IMainWeatherInfo {
  temp: number;
  pressure: number;
  humidity: number;
  temp_min: number;
  temp_max: number;
}

export interface ISecondaryWeatherInfo {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface IWind {
  speed: number;
  deg: number;
}

export interface ICloud {
  all: number;
}

export interface ISys {
  type: number;
  id: number;
  message: number;
  country: string;
  sunrise: number;
  sunset: number;
}

export interface IWeather {
  coord: ICoord;
  weather: ISecondaryWeatherInfo[];
  base: string;
  main: IMainWeatherInfo;
  visibility: number;
  wind: IWind;
  clouds: ICloud;
  dt: number;
  sys: ISys;
  id: number;
  name: string;
  cod: number;
}

