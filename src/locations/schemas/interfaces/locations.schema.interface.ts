import type { Document } from "mongoose";
import mongoose from "mongoose";

export interface ILocation extends Document {
  readonly parents: mongoose.Schema.Types.ObjectId[],
  readonly text: string,
}
