import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ElasticService } from 'src/elastic/services/elastic.service';
import { LocationsService } from 'src/locations/services/locations.service';
import { elasticsearchResponse } from '../../elastic/types/elastic.type';
import { apiResponse } from '../types/api.type';
import { last } from 'lodash';


@Injectable()
export class ApiService {
  private elasticResponse: elasticsearchResponse[];

  constructor(
    private readonly configService: ConfigService,
    private readonly elasticService: ElasticService,
    private readonly locationService: LocationsService,
  ) { }

  // Обработка поискового запроса
  async searchQueryProcessing(qString: string): Promise<apiResponse[]> {

    // запрос к БД elasticSearch
    this.elasticResponse = await this.elasticService.findBySearchString(qString);
    if (this.elasticResponse.length === 0) return;
    // console.log(this.elasticResponse);


    // запрос к MongoDB с целью получить объекты соответствующие массиву ID
    const ids = this.elasticResponse.reduce((acc, {_ids}) => acc.add(last(_ids)), new Set<string>());
    const mongoObjs = await this.locationService.findByLocationId([...ids]);

    const response = this.elasticResponse.map(el => {
      const {_ids, string: text} = el;

      return {
        text,
        meta: mongoObjs.find(({_id}) => _id == last(_ids))
      }
    });

    return response;
    // return this.locationService.request([]);
  }
}
