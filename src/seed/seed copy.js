const mongoose = require('mongoose');
const locations = require('./consts/data.js');
const { createElasticIndex, run } = require('./elastic.js')

mongoose.connect('mongodb://localhost:27017/search-hints', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const LocationsSchema = new mongoose.Schema({
  parents: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Api',
  },
  text: String,
});
const Db = mongoose.model('Api', LocationsSchema);


(async () => {
  // очистка базы монго и эластика
  try {
    await mongoose.connection.collections['apis'].drop(function (err) {
      console.log('collection dropped');
    });
    await createElasticIndex();

  } catch (error) {
    console.log(error);
  }

  const mongo_db = [];
  mongo_db.push(new Db({ text: 'Россия' }));
  const elastic_db = [{ id: mongo_db[0]._id, text: mongo_db[0].text }];


  for (let region in locations) {
    const regionInDb = new Db({ text: region });
    regionInDb.parents = mongo_db[0]._id;
    mongo_db.push(regionInDb);
    elastic_db.push(concatObjs(regionInDb, mongo_db));

    for (let city in locations[region]) {
      const cityInDb = new Db({ text: city });
      cityInDb.parents = regionInDb._id;
      mongo_db.push(cityInDb);
      elastic_db.push(concatObjs(cityInDb, mongo_db));

      locations[region][city].forEach(street => {
        const streetInDb = new Db({ text: street });
        streetInDb.parents = cityInDb._id;
        mongo_db.push(streetInDb);
        elastic_db.push(concatObjs(streetInDb, mongo_db));
      })
    }
  }

  // console.log(mongo_db);
  console.log(elastic_db, elastic_db.length);
  run(elastic_db).catch(console.log)

  try {
    await Db.insertMany(mongo_db)
    await mongoose.disconnect()
    
  } catch (error) {
    console.log(error)
  }
})();


function concatObjs(obj, array) {
  const tempObj = { id: obj._id, parents: [obj.parents], text: obj.text };
  let temp = { id: obj._id, parents: obj.parents, text: obj.text };
  let parentObj = {};

  do {
    parentObj = array.find(el => el._id === temp.parents);
    if (parentObj._id != tempObj.parents[0]) {
      tempObj.parents.unshift(parentObj._id);
    }
    tempObj.text = parentObj.text + ', ' + tempObj.text;
    temp = { id: parentObj._id, parents: parentObj.parents, text: parentObj.text };

  } while (parentObj.parents);

  // console.log(tempObj);
  return tempObj;
}
