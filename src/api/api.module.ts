import { Module } from '@nestjs/common';
import { ElasticModule } from 'src/elastic/elastic.module';
import { LocationsModule } from 'src/locations/locations.module';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';

@Module({
  imports: [ElasticModule, LocationsModule],
  providers: [ApiService],
  controllers: [ApiController]
})
export class ApiModule {}
