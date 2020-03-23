import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { IWeather } from '../interfaces/weather.interface';

@Injectable({
  providedIn: 'root'
})
export class OpenWeatherService {
  private socket: io.Socket;
  private dataLimit = 25;
  private weatherStreamData$ = new BehaviorSubject([]);

  constructor() {
    this.socket = io('http://localhost:3000');

    this.socket.on(
      'newData',
      (currentWeatherData: IWeather) => {
        let weatherDataBuf = this.weatherStreamData$.getValue();

        if (weatherDataBuf.length >= this.dataLimit) {
          weatherDataBuf = weatherDataBuf.splice(1, 20);
        }

        this.weatherStreamData$.next([
          ...weatherDataBuf,
          currentWeatherData
        ]);
      },
    );
  }

  public startStreamWeatherByCityName(locationParam: string): void {
    this.socket.emit('startStreamWeatherByCityName', locationParam);
  }

  public stopSteamWeatherByCityName(): void {
    this.socket.emit('stopSteamWeatherByCityName');
  }

  public getWeatherData(): Observable<any> {
    return this.weatherStreamData$.asObservable();
  }

}
