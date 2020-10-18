import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { ApiModule } from './api/api.module';

const environment = process.env.NODE_ENV || 'development';


@Module({
  imports: [
    ApiModule,

    ConfigModule.forRoot({
      envFilePath: `.env.${environment}`,
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_WRITE_CONNECTION_STRING'),
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),

  ],

})

export class AppModule {}
