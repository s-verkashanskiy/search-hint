import { Document } from "mongoose";

export interface localResponse extends Document{
  readonly text: string,
  readonly meta: localResponse,
}
