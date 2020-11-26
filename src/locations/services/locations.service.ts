import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ILocation } from '../schemas/interfaces/locations.schema.interface';

import { localResponse } from '../types/locations.type';


@Injectable()
export class LocationsService {
  constructor(@InjectModel('api') private localModel: Model<ILocation>) {}

  // запрос к БД MongoDB по массиву ID
  async findByLocationId(idArray: string[]): Promise<localResponse[]> {

    console.log('--------------------------\nid, передаваемые в MongoDB', idArray);
    

    return this.localModel.find({_id: { $in: idArray }}).select({ text: 1, parents: 1 }).lean().exec();
    // find().where('_id').in(idArray).select(...)
    // return await this.localModel.find().exec();
  }
}
