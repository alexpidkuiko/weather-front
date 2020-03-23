import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { OpenWeatherService } from '../../shared/services/open-weather.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  public isStreamOpen: boolean;
  public locationControl: FormControl = new FormControl('', Validators.required);

  constructor(private openWeatherService: OpenWeatherService) { }

  public ngOnInit(): void {
  }

  public startWeatherStream(): void {
    this.openWeatherService.startStreamWeatherByCityName(this.locationControl.value);
    this.isStreamOpen = true;
  }

  public stopWeatherStream(): void {
    this.openWeatherService.stopSteamWeatherByCityName();
    this.isStreamOpen = false;
  }

}
