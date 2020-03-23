import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { IWeather } from '../../../../shared/interfaces/weather.interface';

@Component({
  selector: 'app-weather-chart',
  templateUrl: './weather-chart.component.html',
  styleUrls: ['./weather-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeatherChartComponent implements OnInit, OnChanges {
  @Input() public transitionTime = 1000;
  @Input() public xmax = 45;
  @Input() public ymax = 200;
  @Input() public hticks = 60;
  @Input() public data: IWeather[];
  @Input() public showLabel = true;

  public hostElement;
  public svg;
  public g;
  public colorScale;
  public x;
  public y;
  public bins;
  public paths;
  public area;
  public histogram;


  constructor(private elRef: ElementRef, private cdr: ChangeDetectorRef) {
    this.hostElement = this.elRef.nativeElement;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
      this.updateChart(changes.data.currentValue);
    }
  }

  public ngOnInit(): void {
  }

  public createChart(data: IWeather[]) {
    this.removeExistingChartFromParent();
    this.setChartDimensions();
    this.setColorScale();
    this.addGraphicsElement();
    this.createXAxis();
    this.createYAxis();

    this.area = d3.area()
      .x((datum: any) => this.x(d3.mean([datum.x1, datum.x2])))
      .y0(this.y(0))
      .y1((datum: any) => this.y(datum.length));


    this.histogram = d3.histogram()
      .value((datum) => datum)
      .domain([0, this.xmax])
      .thresholds(this.x.ticks(this.hticks));

    this.processData(data);
    this.createAreaCharts();
  }

  public updateChart(data: IWeather[]) {
    if (!this.svg) {
      this.createChart(data);
      return;
    }

    this.processData(data);

    this.updateAreaCharts();

    this.cdr.detectChanges();
  }

  private createAreaCharts() {
    this.paths = [];
    this.bins.forEach((row, index) => {
      this.paths.push(this.g.append('path')
        .datum(row)
        .attr('fill', this.colorScale('' + index))
        .attr('stroke-width', 0.1)
        .attr('opacity', 0.5)
        .attr('d', (datum: any) => this.area(datum))
      );
    });
  }

  private updateAreaCharts() {
    this.paths.forEach((path, index) => {
      path.datum(this.bins[index])
        .transition().duration(this.transitionTime)
        .attr('d', d3.area()
          .x((datum: any) => this.x(d3.mean([datum.x1, datum.x2])))
          .y0(this.y(0))
          .y1((datum: any) => this.y(datum.length)));

    });
  }

  private removeExistingChartFromParent(): void {
    d3.select(this.hostElement).select('svg').remove();
  }

  private setChartDimensions(): void {
    const viewBoxHeight = 100;
    const viewBoxWidth = 200;

    this.svg = d3.select(this.hostElement).append('svg')
      .attr('width', '75%')
      .attr('height', '75%')
      .attr('viewBox', '0 0 ' + viewBoxWidth + ' ' + viewBoxHeight);
  }

  private setColorScale(): void {
    this.colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  }

  private addGraphicsElement(): void {
    this.g = this.svg.append('g')
      .attr('transform', 'translate(0,0)');
  }

  private createXAxis(): void {
    this.x = d3.scaleLinear()
      .domain([0, this.xmax])
      .range([30, 170]);
    this.g.append('g')
      .attr('transform', 'translate(0,90)')
      .attr('stroke-width', 0.5)
      .call(d3.axisBottom(this.x).tickSize(0).tickFormat( '' as any));

    this.g.append('g')
      .attr('transform', 'translate(0,90)')
      .style('font-size', '6')
      .style('stroke-dasharray', ('1,1'))
      .attr('stroke-width', 0.1)
      .call(d3.axisBottom(this.x).ticks(10).tickSize(-80));
  }

  private createYAxis(): void {
    this.y = d3.scaleLinear()
      .domain([0, this.ymax])
      .range([90, 10]);
    this.g.append('g')
      .attr('transform', 'translate(30,0)')
      .attr('stroke-width', 0.5)
      .call(d3.axisLeft(this.y).tickSize(0).tickFormat('' as any));
    this.g.append('g')
      .attr('transform', 'translate(30,0)')
      .style('stroke-dasharray', ('1,1'))
      .attr('stroke-width', 0.1)
      .call(d3.axisLeft(this.y).ticks(4).tickSize(-140))
      .style('font-size', '6');

    if (this.showLabel) {
      this.g.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(10,50) rotate(-90)')
        .style('font-size', 8)
        .text('Temperature');
    }
  }

  private processData(data: IWeather[]): void {
    this.bins = [];
    data.forEach((row) => {
      this.bins.push(this.histogram(row));
    });
  }
}
