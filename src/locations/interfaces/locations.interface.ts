import { Document } from "mongoose";

export interface localResponse extends Document{
  readonly parent: string,
  readonly text: string,
}
