import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class LengthValidationPipe implements PipeTransform {
  private maxQueryLength: number;
  
  constructor(private readonly configService: ConfigService) {
    this.maxQueryLength = parseInt(this.configService.get<string>('SEARCH_STRING_LENGTH'), 10);
  }

  transform(value: string, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException('Query required');
    }
    if (value.length === 0 || value.length > this.maxQueryLength) {
      throw new BadRequestException('Bad query');
    }

    return value;
  }
}
