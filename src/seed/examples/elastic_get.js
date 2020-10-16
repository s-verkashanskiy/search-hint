const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://localhost:9200' })

async function run() {

  // Let's search!
  const { body } = await client.search({
    index: 'locations',
    body: {
      query: {
        query_string: {
          query: "*кот*",
          fields: ["title", "text"],
          analyze_wildcard: true,
          allow_leading_wildcard: true
        }
        // match: {
        //   text: 'который'
        // }
        // match_phrase: {
        //   locationname: "Москва",
        // }
        // bool: {
        //   must: [
        //     { match: { title: "oбъект" } },
        //     { match_phrase: { text: "связан с" } }
        //   ]
        // }
        // filter: [
        //   { term: { title: "oбъект9"   }},
        //   { term: { text: "улицей" }}
        // ]
      }
    }
  })

  console.log(body.hits.hits)
}

// async function run () {
//   // Let's start by indexing some data
//   await client.index({
//     index: 'game-of-thrones',
//     body: {
//       character: 'Ned Stark',
//       quote: 'Winter is coming.'
//     }
//   })

//   await client.index({
//     index: 'game-of-thrones',
//     body: {
//       character: 'Daenerys Targaryen',
//       quote: 'I am the blood of the dragon.'
//     }
//   })

//   await client.index({
//     index: 'game-of-thrones',
//     // here we are forcing an index refresh,
//     // otherwise we will not get any result
//     // in the consequent search
//     refresh: true,
//     body: {
//       character: 'Tyrion Lannister',
//       quote: 'A mind needs books like a sword needs a whetstone.'
//     }
//   })

//   // Let's search!
//   const { body } = await client.search({
//     index: 'game-of-thrones',
//     body: {
//       query: {
//         match: {
//           quote: 'winter'
//         }
//       }
//     }
//   })

//   console.log(body.hits.hits)
// }

run().catch(error => console.log(error.meta.body.error))
