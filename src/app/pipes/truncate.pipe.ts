import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'truncate'})

export class TruncatePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    if(value.length > 100){
      return value.substr(0, 100) + "...";
    }else{
      return value
    }
  }

}
