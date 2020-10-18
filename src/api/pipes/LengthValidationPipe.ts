import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Проверяет строку запроса на органичение по длине

@Injectable()
export class LengthValidationPipe implements PipeTransform {
  maxQueryLength: number;
  constructor(private readonly configService: ConfigService) {
    this.maxQueryLength = +this.configService.get<string>('SEARCH_STRING_LENGTH');
  }
  transform(value: string, metadata: ArgumentMetadata) {
    if (!value)
      throw new BadRequestException('Query required');
    if (value.length === 0 || value.length > this.maxQueryLength)
      throw new BadRequestException('Bad query');
    return value;
  }
}
