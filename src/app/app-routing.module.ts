import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OpenWeatherComponent } from './core/open-weather/open-weather.component';

const routes: Routes = [
  {
    path: '',
    component: OpenWeatherComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
