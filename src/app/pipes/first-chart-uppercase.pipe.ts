import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstChartUppercase'
})
export class FirstChartUppercasePipe implements PipeTransform {

  transform(value: string): string {
    const firstChart = value.charAt(0).toUpperCase();
    const restOfWord = value.substr(1);
    return firstChart + restOfWord
  }

}
