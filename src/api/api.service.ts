import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ElasticService } from 'src/elastic/elastic.service';
import { LocationsService } from 'src/locations/locations.service';
import { elasticsearchResponse } from '../elastic/elastic.interface';


@Injectable()
export class ApiService {
  private readonly maxQueryLength: number;
  private elasticResponse: elasticsearchResponse[];

  constructor(
    private readonly configService: ConfigService,
    private readonly elasticService: ElasticService,
    private readonly locationService: LocationsService,
  ) {
    this.maxQueryLength = +this.configService.get<string>('SEARCH_STRING_LENGTH');
  }

  // Обработка поискового запроса
  async searchQueryProcessing(qString: string): Promise<any> {

    // запрос к БД elasticSearch
    this.elasticResponse = await this.elasticService.request(qString);
    if (this.elasticResponse.length === 0) return;


    // запрос к MongoDB с целью получить объекты соответствующие массиву ID
    return await this.locationService.request(this.elasticResponse.map(obj => obj._id));
    // return await this.locationService.request([]);
  }
}
