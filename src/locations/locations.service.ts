import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { localResponse } from './locations.interface';


@Injectable()
export class LocationsService {
  constructor(@InjectModel('api') private localModel: Model<localResponse>) {}

  // Метод запроса к БД MongoDB по массиву ID
  async request(idArray: string[]) { //: localResponse[] {

    console.log('--------------------------\nid, передаваемые в MongoDB', idArray);
    

    return await this.localModel.find({_id: { $in: idArray }}).exec();
    // return await this.localModel.find().exec();
  }
}
