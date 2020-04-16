import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';

import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';


@Component({
  selector: 'app-weather-chart',
  templateUrl: './weather-chart.component.html',
  styleUrls: ['./weather-chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class WeatherChartComponent implements OnInit, OnChanges {
  private margin = {top: 20, right: 20, bottom: 30, left: 50};
  private readonly width: number;
  private readonly height: number;

  @Input('weatherData')
  set weatherData(weatherList) {
    if (weatherList.length > 0) {
      this.currentWeatherData.push({
        temp: weatherList[weatherList.length - 1].value,
        time: Date.now(),
      });
    }

    if (this.currentWeatherData.length > 10) {
      this.currentWeatherData.shift();
    }
  }

  currentWeatherData = [];

  constructor(private cdr: ChangeDetectorRef) {
    this.width = 900 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.weatherData && !changes.weatherData.firstChange) {
      this.updateChart();

      this.cdr.detectChanges();
    }
  }


  ngOnInit() {
    this.initSvg();
  }

  private initSvg() {
    this.initChart();
  }

  get chartContext() {
    return d3.select('svg');
  }

  get lineContext() {
    return d3.select<SVGPathElement, any>('path.chart-line');
  }

  get xAxis() {
    return d3.select<SVGGElement, any>('g.axis--x');
  }

  get yAxis() {
    return d3.select<SVGGElement, any>('g.axis--y');
  }

  get xScale() {
    const x = d3Scale.scaleTime().range([0, this.width]);

    x.domain(d3Array.extent(this.currentWeatherData, (d) => d.time) as number[]);

    return x;
  }

  get yScale() {
    const y = d3Scale.scaleLinear().range([this.height, 0]);

    y.domain([50, -50]);

    return y;
  }

  private updateChart() {
    this.applyXAxis();
    this.applyYAxis();
    this.applyLine();
  }

  private applyXAxis() {
    const xModifier = d3Axis.axisBottom(this.xScale);

    this.xAxis.call(xModifier);
  }

  private applyYAxis() {
    const yModifier = d3Axis.axisLeft(this.yScale);

    this.yAxis.call(yModifier);
  }

  private applyLine() {
    const line: any = d3Shape.line()
      .x((d: any) => this.xScale(d.time))
      .y((d: any) => this.yScale(d.temp));

    this.lineContext
      .datum(this.currentWeatherData)
      .attr('d', line);
  }

  private initChart() {
    this.chartContext
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    this.chartContext
      .append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + this.height + ')');

    this.applyXAxis();

    this.xAxis
      .append('text')
      .attr('class', 'axis-title')
      .attr('x', this.width)
      .attr('dy', '-1em')
      .style('text-anchor', 'end')
      .text('Time');

    this.chartContext
      .append('g')
      .attr('class', 'axis axis--y');

    this.applyYAxis();

    this.yAxis
      .append('text')
      .attr('class', 'axis-title')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '1em')
      .style('text-anchor', 'end')
      .text('Temperature C');


    this.chartContext
      .append('g')
      .attr('class', 'chart-line-group')
      .append('path')
      .attr('class', 'chart-line');

    this.applyLine();
  }
}
