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
        // sort: [
        //   { text: { order: "asc" } },
        //   "_score"
        // ],
        query: {
          // тип запроса query_string, позволяет искать часть слова (match ищет целое слово)
          query_string: {
            query: `*${searchString}*`,
            fields: ['text'],
          }
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

    const result = [];
    const docs = body.hits.hits;

    for (let docIndex = 0; docIndex < docs.length; docIndex++) {

      const tempObj = {
        strings: [],
        _id: ''
      };

      for (let field in docs[docIndex].highlight) {

        tempObj.strings.push(docs[docIndex].highlight[field][0]);
      };

      tempObj._id = docs[docIndex]._source.id;
      result.push(tempObj);
    }

    console.log('----------------------------------\nРезультаты запроса в ElasticSearch', result);


    return result;
  }
}
