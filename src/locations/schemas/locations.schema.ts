import * as mongoose from 'mongoose';

export const LocationsSchema = new mongoose.Schema({
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Api',
  },
  text: String,
});
