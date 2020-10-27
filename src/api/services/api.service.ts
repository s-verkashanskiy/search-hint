import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ElasticService } from 'src/elastic/services/elastic.service';
import { localResponse } from 'src/locations/interfaces/locations.interface';
import { LocationsService } from 'src/locations/services/locations.service';
import { elasticsearchResponse } from '../../elastic/interfaces/elastic.interface';


@Injectable()
export class ApiService {
  private elasticResponse: elasticsearchResponse[];

  constructor(
    private readonly configService: ConfigService,
    private readonly elasticService: ElasticService,
    private readonly locationService: LocationsService,
  ) { }

  // Обработка поискового запроса
  async searchQueryProcessing(qString: string): Promise<any[]> {

    // запрос к БД elasticSearch
    this.elasticResponse = await this.elasticService.findBySearchString(qString);
    if (this.elasticResponse.length === 0) return;
    // console.log(this.elasticResponse);


    // запрос к MongoDB с целью получить объекты соответствующие массиву ID
    const ids = this.elasticResponse.map(obj => obj._ids[obj._ids.length - 1]);
    const mongoObjs = await this.locationService.findByLocationId([...new Set(ids)]);

    const response = this.elasticResponse.map(el => {

      return {
        text: el.string[0],
        meta: mongoObjs.find(obj => obj._id == el._ids[el._ids.length - 1])
      }
    });

    return response;
    // return this.locationService.request([]);
  }
}
