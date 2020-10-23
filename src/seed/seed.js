const mongoose = require('mongoose');
const locations = require('./consts/data.js');
const run = require('./elastic.js')

mongoose.connect('mongodb://localhost:27017/search-hints', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const LocationsSchema = new mongoose.Schema({
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Api',
  },
  text: String,
});
const Db = mongoose.model('Api', LocationsSchema);

const mongo_db = [];
mongo_db.push(new Db({ text: 'Россия' }));
const elastic_db = [{ id: mongo_db._id, text: mongo_db.text }];


for (let region in locations) {
  const regionInDb = new Db({ text: region });
  regionInDb.parent = mongo_db[0]._id;
  mongo_db.push(regionInDb);
  elastic_db.push(concatObjs(regionInDb, mongo_db));

  for (let city in locations[region]) {
    const cityInDb = new Db({ text: city });
    cityInDb.parent = regionInDb._id;
    mongo_db.push(cityInDb);
    elastic_db.push(concatObjs(cityInDb, mongo_db));

    locations[region][city].forEach(street => {
      const streetInDb = new Db({ text: street });
      streetInDb.parent = cityInDb._id;
      mongo_db.push(streetInDb);
      elastic_db.push(concatObjs(streetInDb, mongo_db));
    })
  }
}

// console.log(mongo_db);
console.log(elastic_db);
run(elastic_db).catch(console.log)

Db.insertMany(mongo_db)
.then(()=> mongoose.disconnect())
.catch(error => console.log(error));



function concatObjs(obj, array) {
  const tempObj = { id: obj._id, parent: obj.parent, text: obj.text };
  let temp = { id: obj._id, parent: obj.parent, text: obj.text };
  let parentObj = {};

  do {
    parentObj = array.find(el => el._id === temp.parent);
    tempObj.text = parentObj.text + ', ' + tempObj.text;
    temp = { id: parentObj._id, parent: parentObj.parent, text: parentObj.text };
    
  } while (parentObj.parent);

  // console.log(tempObj);
  return tempObj;
}
