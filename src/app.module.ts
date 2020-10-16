import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { ElasticModule } from './elastic/elastic.module';
import { ApiModule } from './api/api.module';
import { LocationsModule } from './locations/locations.module';

const environment = process.env.NODE_ENV || 'development';


@Module({
  imports: [
    ApiModule,
    ElasticModule,
    LocationsModule,

    ConfigModule.forRoot({
      envFilePath: `.env.${environment}`,
      isGlobal: true,
    }),

    MongooseModule.forRoot(
      process.env.MONGODB_WRITE_CONNECTION_STRING,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      }
    ),

  ],

})

export class AppModule {}
