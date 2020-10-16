import * as mongoose from 'mongoose';

export const LocationsSchema = new mongoose.Schema({
  title: String,
  locationType: String,
  locationName: String,
  text: String,
});
