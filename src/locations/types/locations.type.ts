import { ILocation } from "../schemas/interfaces/locations.schema.interface";

export type localResponse = Pick<ILocation, 'text'|'parents'|'_id'>;
