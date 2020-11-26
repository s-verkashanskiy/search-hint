const { Client } = require('@elastic/elasticsearch')
const client = new Client({
  node: 'http://localhost:9200'
})

async function createElasticIndex() {

  // очистка эластика
  try {
    await client.indices.delete({ index: '_all' }, { ignore: [404] });
  } catch (error) {
    console.error(error.message);
  }
  console.log('Indexes have been deleted!');


  // создание индекса с анализатором
  try {
    await client.indices.create({
      index: 'locations',
      body: {
        settings: {
          // 'index.number_of_shards': 5,
          // 'index.number_of_replicas': 0,
          index: {
            analysis: {
              filter: {
                nGram_filter: {
                  type: 'nGram',
                  min_gram: 3,
                  max_gram: 4
                },
                // edgenGram_filter: {
                //   type: 'edgeNGram',
                //   min_gram: 2,
                //   max_gram: 20
                // },
                worddelimiter: {
                  catenate_all: 'true',
                  type: 'word_delimiter',
                  preserve_original: 'true'
                },
                // yo_filter: {
                //   type: 'mapping',
                //   mappings: ['ё => е', 'Ё => Е']
                // },
                stopwords: {
                  type: 'stop',
                  stopwords: '_russian_',
                  ignore_case: true
                }
              },
              tokenizer: {
                nGram: {
                  type: 'nGram',
                  min_gram: 3,
                  max_gram: 4,
                  token_chars: ['letter', 'digit']
                }
              },
              analyzer: {
                ngram_index_analyzer: {
                  type: 'custom',
                  tokenizer: 'nGram',
                  filter: [
                    'stopwords',
                    'nGram_filter',
                    'asciifolding',
                    'lowercase',
                    'worddelimiter',
                    // 'russian_morphology',
                    // 'char_filter',
                  ]
                },
                // edge_ngram_index_analyzer: {
                //   type: "custom",
                //   tokenizer: "keyword",
                //   filter: ['lowercase', 'edgenGram_filter']
                // },
                // substring_analyzer: {
                //   type: 'custom',
                //   tokenizer: 'nGram',
                //   char_filter: ['yo_filter'],
                //   filter: [
                //     'stopwords',
                //     'app_ngram',
                //     'asciifolding',
                //     'lowercase',
                //     'worddelimiter',
                //     'russian_morphology',
                //     'char_filter',
                //   ]
                // }
              },
            }
          }
        },
        mappings: {
          properties: {
            id: { type: 'text', index: false },
            parents: { type: 'text', index: false },
            text: { type: 'text', analyzer: 'ngram_index_analyzer'} //, search_analyzer: 'standard' }
          }
        }
      }
    }, { ignore: [400] })

  } catch (error) {
    console.log('!!!!!!!!!!!', error);
    // console.log('!!!!!!!!!!!', error.meta.body);  
  }
}


async function run(dataset) {

  const body = dataset.flatMap(doc => [{ index: { _index: 'locations' } }, doc])
  console.log(body);
  const { body: bulkResponse } = await client.bulk({ refresh: true, body })

  if (bulkResponse.errors) {
    const erroredDocuments = []
    // The items array has the same order of the dataset we just indexed.
    // The presence of the `error` key indicates that the operation
    // that we did for the document has failed.
    bulkResponse.items.forEach((action, i) => {
      const operation = Object.keys(action)[0]
      if (action[operation].error) {
        erroredDocuments.push({
          // If the status is 429 it means that you can retry the document,
          // otherwise it's very likely a mapping error, and you should
          // fix the document before to try it again.
          status: action[operation].status,
          error: action[operation].error,
          operation: body[i * 2],
          document: body[i * 2 + 1]
        })
      }
    })
    console.log(erroredDocuments)
  }

  const { body: count } = await client.count({ index: 'locations' })
  console.log(count)
}

// run().catch(console.log)


module.exports = { createElasticIndex, run };
