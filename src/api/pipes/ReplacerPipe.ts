import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { replacer } from 'src/api/pipes/consts/replacer';


@Injectable()
export class ReplacerPipe implements PipeTransform {
  
  transform(value: string, metadata: ArgumentMetadata) {
    value = value.toLowerCase();
    let result = '';

    for (let index = 0; index < value.length; index++) {
      const letter = value.charAt(index);
      result += replacer.has(letter) ? replacer.get(letter) : letter;
    }

    return result;
  }
}
