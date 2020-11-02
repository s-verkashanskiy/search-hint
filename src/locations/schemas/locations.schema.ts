import * as mongoose from 'mongoose';

export const LocationsSchema = new mongoose.Schema({
  parents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Api',
    }
  ],
  text: String,
});
