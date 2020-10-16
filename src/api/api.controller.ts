import { ArgumentMetadata, BadRequestException, Controller, Get, Injectable, PipeTransform, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { replacer } from 'src/consts/replacer';
import { ApiService } from './api.service'

// Транслитерирует строку запроса (eng->rus по qwerty)
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
    // return value;
  }
}

// Проверяет строку запроса на органичение по длине
@Injectable()
export class LengthValidationPipe implements PipeTransform {
  maxQueryLength: number;
  constructor(private readonly configService: ConfigService) {
    this.maxQueryLength = +this.configService.get<string>('SEARCH_STRING_LENGTH');
  }
  transform(value: string, metadata: ArgumentMetadata) {
    if (value.length === 0 || value.length > this.maxQueryLength) throw new BadRequestException('Bad query');
    return value;
  }
}


@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) { }

  @Get('suggest')
  async find(@Query('query', LengthValidationPipe, ReplacerPipe) qString): Promise<any> {
    console.log('Пользовательская строка запроса: ', qString);

    // запросы к ElasticSearch и к MongoDB. Результат возвращаем пользователю.
    return await this.apiService.searchQueryProcessing(qString);
  };
}
