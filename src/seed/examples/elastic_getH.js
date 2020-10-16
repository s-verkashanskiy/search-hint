const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://localhost:9200' })

async function run() {

  // Let's search!
  const { body } = await client.search({
    index: 'locations',
    body: {
      query: {
        // тип запроса query_string, позволяет искать часть слова (match только ищет целиком)
        query_string: {
          query: "*кий | *9",
          fields: ["title", "text" ],
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
              pre_tags: ["<em>"],
              post_tags: ["</em>"]
            }
          },
          {
            text: {
              // matched_fields: ["text", "text.plain"],
              // type: "fvh",
              pre_tags: ["<em>"],
              post_tags: ["</em>"]
            }
          }
        ]
      }
    // highlight: {
    //   fields: [
    //     { title: { pre_tags: ["<em>"], post_tags: ["</em>"] } },
    //     { text: { pre_tags: ["<b>"], post_tags: ["</b>"] } }
    //   ]
    // }
  }
  })
console.log(body.hits.hits)
console.log(body.hits.hits[0].highlight.title)
console.log(body.hits.hits[0].highlight.text)
}

run().catch(error => console.log(error))
// run().catch(error => console.log(error.meta.body.error))
