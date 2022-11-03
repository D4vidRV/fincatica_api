import { Injectable } from '@nestjs/common';

@Injectable()
export class SeedService {
  executeSeed() {
    return `Seed executed`;
  }

  incrementSeed() {
    return `Service to increment numbers`;
  }
}
