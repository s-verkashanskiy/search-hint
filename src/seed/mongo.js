const mongoose = require('mongoose');
const mongo_consts = require('./consts/mongo_consts.txt');

mongoose.connect('mongodb://localhost:27017/search-hints', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const LocationsSchema = new mongoose.Schema({
  title: String,
  locationType: String,
  locationName: String,
  text: String,
});

mongoose.model('Api', LocationsSchema)
.insertMany(JSON.parse(mongo_consts))
.then(()=> mongoose.disconnect())
.catch(error => console.log(error));
