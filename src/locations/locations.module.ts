import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { LocationsService } from './services/locations.service';
import { LocationsSchema } from './schemas/locations.schema';


@Module({
  imports: [MongooseModule.forFeature([{ name: 'api', schema: LocationsSchema }])],
  providers: [LocationsService],
  exports: [LocationsService]
})
export class LocationsModule {}
