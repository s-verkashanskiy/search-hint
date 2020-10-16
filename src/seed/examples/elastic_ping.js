const es = require('elasticsearch');


const esClient = new es.Client({
    host: 'localhost:9200',
    log: 'trace'
});



esClient.ping({
  // ping usually has a 3000ms timeout
      requestTimeout: 1000
  }, function (error) {
      if (error) {
          console.trace('elasticsearch cluster is down!');
      } else {
          console.log('All is well');
      }
});









module.exports = esClient;


