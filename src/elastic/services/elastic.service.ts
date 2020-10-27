import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { elasticsearchResponse } from '../interfaces/elastic.interface';

// import { Client } from '@elastic/elasticsearch';
// const client = new Client({ node: 'http://localhost:9200' });


@Injectable()
export class ElasticService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}
  // метод, который реализует запрос к elastic и возвращает массив объектов с интерфейсом elasticsearchResponse
  async findBySearchString(searchString: string): Promise<elasticsearchResponse[]> {

    const { body } = await this.elasticsearchService.search({
      index: 'locations',
      body: {
        sort: [
          // { text: { order: "asc" } },
          "_score"
        ],
        size: 10,
        query: {
          match: {
            text: {
              query: `*${searchString}*`,
              // позволяет искать слова, которые содержат ошибочные буквы (auto - любое количество исправлений)
              fuzziness: "AUTO",
              operator: "and"
            }
          }
          // тип запроса query_string, позволяет искать часть слова (match ищет целое слово)
          // query_string: {
          //   query: `${searchString}`,
          //   fields: ['text'],
          // }
        },
        highlight: {
          order: "score",
          // By default, only fields that contains a query match are highlighted. Set require_field_match to false to highlight all fields
          require_field_match: false,
          fields: [
            {
              text: {
                // matched_fields: ["text", "text.plain"],
                // type: "fvh",
                pre_tags: ["<b>"],
                post_tags: ["</b>"]
              }
            }
          ]
        }
      }
    })
    // console.log(JSON.stringify(body, null, 2));

    const result = [];
    const docs = body.hits.hits;
    
    for (let docIndex = 0; docIndex < docs.length; docIndex++) {

      const tempObj = {
        string: [],
        _ids: []
      };

      const  {[docIndex]: { highlight, _source } } = docs;
      const hlKeys = Object.keys(highlight);

      for (let fieldIndex = 0; fieldIndex < hlKeys.length; fieldIndex++) {
        const field = hlKeys[fieldIndex];
        const {[field]: [hl]} = highlight;
        tempObj.string.push(hl);
        
      }
      tempObj._ids = [..._source.parents];
      result.push(tempObj);
    }

    console.log('----------------------------------\nРезультаты запроса в ElasticSearch', result, result.length);


    return result;
  }
}
