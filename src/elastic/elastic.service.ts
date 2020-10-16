import { Injectable } from '@nestjs/common';
import { elasticsearchResponse } from './elastic.interface';
import { Client } from '@elastic/elasticsearch';
const client = new Client({ node: 'http://localhost:9200' });


const elasticResponse = [
];


@Injectable()
export class ElasticService {
  // метод, который реализует запрос к elastic и возвращает массив объектов с интерфейсом elasticsearchResponse

  request(searchString: string): elasticsearchResponse[] {
    client.search({
      index: 'locations',
      body: {
        query: {
          // тип запроса query_string, позволяет искать часть слова (match только ищет целиком)
          query_string: {
            query: searchString,
            fields: ['title', , 'locationtype', 'locationname', 'text'],
            analyze_wildcard: true,
            allow_leading_wildcard: true
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
      .then({ body }=> {
        console.log(body.hits.hits)
        console.log(body.hits.hits[0].highlight.title)
        console.log(body.hits.hits[0].highlight.text)
        return body.hits.hits.reduce((result, doc) => {
          result[0].push(doc._source._id);
        }, [[], []]);
      }).
      catch(error => console.log(error);

  }
}
