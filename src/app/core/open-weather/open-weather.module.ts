import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpenWeatherComponent } from './open-weather.component';
import { OpenWeatherService } from '../../shared/services/open-weather.service';
import { HeaderModule } from '../header/header.module';
import { WeatherChartComponent } from './components/weather-chart/weather-chart.component';



@NgModule({
  declarations: [
    OpenWeatherComponent,
    WeatherChartComponent
  ],
  imports: [
    CommonModule,
    HeaderModule,
  ],
  providers: [OpenWeatherService]
})
export class OpenWeatherModule { }
