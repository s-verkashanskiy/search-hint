import { Controller, Get, Query } from '@nestjs/common';
import { ApiService } from '../services/api.service'
import { LengthValidationPipe, ReplacerPipe } from '../pipes';


@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) { }

  // http://localhost:9200/_search?q=text:улица
  // http://localhost:3000/api/suggest?query=кий
  @Get('suggest')
  find(@Query('query', LengthValidationPipe, ReplacerPipe) qString): any {
    console.log('Пользовательская строка запроса: ', qString);

    // запросы к ElasticSearch и к MongoDB. Результат возвращаем пользователю.
    return this.apiService.searchQueryProcessing(qString);
  };
}
