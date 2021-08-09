import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nombre'
})
export class NombrePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if(value != undefined) return parseFloat(value).toFixed(2);
  }

}
