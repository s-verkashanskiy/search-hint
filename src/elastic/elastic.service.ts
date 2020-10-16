import { Injectable } from '@nestjs/common';
import { elasticsearchResponse } from './elastic.interface';
import { Client } from '@elastic/elasticsearch';
const client = new Client({ node: 'http://localhost:9200' });


@Injectable()
export class ElasticService {
  // метод, который реализует запрос к elastic и возвращает массив объектов с интерфейсом elasticsearchResponse

  async request(searchString: string): Promise<elasticsearchResponse[]> {
    
    const { body } = await client.search({
      index: 'locations',
      body: {
        query: {
          // тип запроса query_string, позволяет искать часть слова (match ищет целое слово)
          query_string: {
            query: `*${searchString}*`,
            fields: ['title', 'locationtype', 'locationname', 'text'],
            // analyze_wildcard: true,
            // allow_leading_wildcard: true
          }
        },
        highlight: {
          order: "score",
          // By default, only fields that contains a query match are highlighted. Set require_field_match to false to highlight all fields
          require_field_match: false,
          fields: [
            {
              title: {
                // matched_fields: ["title", "title.plain^10"],
                // type: "fvh",
                pre_tags: ["<b>"],
                post_tags: ["</b>"]
              }
            },
            {
              locationtype: {
                // matched_fields: ["title", "title.plain^10"],
                // type: "fvh",
                pre_tags: ["<b>"],
                post_tags: ["</b>"]
              }
            },
            {
              locationname: {
                // matched_fields: ["title", "title.plain^10"],
                // type: "fvh",
                pre_tags: ["<b>"],
                post_tags: ["</b>"]
              }
            },
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

    const result = [];
    for (let doc of body.hits.hits) {
      const tempObj = {
        strings: [],
        _id: ''
      };
      for (let field in doc.highlight) {
  
        tempObj.strings.push(doc.highlight[field][0]);
      };
      tempObj._id = doc._source.id;
      result.push(tempObj);
    }
    
    console.log('----------------------------------\nРезультаты запроса в ElasticSearch', result);
    
    return result;
  }
}
