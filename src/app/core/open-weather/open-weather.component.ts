import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { OpenWeatherService } from '../../shared/services/open-weather.service';
import {  Subject } from 'rxjs';
import { IWeather } from '../../shared/interfaces/weather.interface';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-open-weather',
  templateUrl: './open-weather.component.html',
  styleUrls: ['./open-weather.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpenWeatherComponent implements OnInit, OnDestroy {
  public weatherData: any[] = [];

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private openWeatherService: OpenWeatherService,
              private cdr: ChangeDetectorRef) { }

  public ngOnInit(): void {
    this.initListeners();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initListeners(): void {
    this.openWeatherService.getWeatherData()
      .pipe(
        filter((data) => Boolean(data.length)),
        takeUntil(this.destroy$)
      )
      .subscribe((data: IWeather[]) => {
        this.weatherData = data.map(({main}) => ({value: main.temp, date: new Date()}));
        this.cdr.markForCheck();
    });
  }
}
