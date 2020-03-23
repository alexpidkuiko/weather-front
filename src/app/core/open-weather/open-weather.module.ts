import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpenWeatherComponent } from './open-weather.component';
import { OpenWeatherService } from '../../shared/services/open-weather.service';
import { HeaderModule } from '../header/header.module';



@NgModule({
  declarations: [OpenWeatherComponent],
  imports: [
    CommonModule,
    HeaderModule,
  ],
  providers: [OpenWeatherService]
})
export class OpenWeatherModule { }
