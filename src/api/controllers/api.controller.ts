import { Controller, Get, Query } from '@nestjs/common';
import { ApiService } from '../services/api.service'
import { LengthValidationPipe, ReplacerPipe } from '../pipes';
import { apiResponse } from '../types/api.type';


@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) { }

  // http://localhost:9200/_search?q=text:улица
  // http://localhost:3000/api/suggest?query=кий
  @Get('suggest')
  async find(@Query('query', LengthValidationPipe, ReplacerPipe) qString): Promise<any> {
    console.log('Пользовательская строка запроса: ', qString);

    // запросы к ElasticSearch и к MongoDB. Результат возвращаем пользователю.
    const result = await this.apiService.searchQueryProcessing(qString);
    if (result.length) {
      return result;
    } else {
      return [{text: ''}];
    }

     
  };
}
