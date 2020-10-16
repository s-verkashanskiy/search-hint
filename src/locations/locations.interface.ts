import { Document } from "mongoose";

export interface localResponse extends Document{
  readonly title: string,
  readonly locationType: string,
  readonly locationName: string,
  readonly text: string,
}
