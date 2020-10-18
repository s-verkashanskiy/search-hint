import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { localResponse } from '../interfaces/locations.interface';


@Injectable()
export class LocationsService {
  constructor(@InjectModel('api') private localModel: Model<localResponse>) {}

  // запрос к БД MongoDB по массиву ID
  async findByLocationId(idArray: string[]): Promise<localResponse[]> {

    console.log('--------------------------\nid, передаваемые в MongoDB', idArray);
    

    return await this.localModel.find({_id: { $in: idArray }}).lean();
    // return await this.localModel.find().exec();
  }
}
