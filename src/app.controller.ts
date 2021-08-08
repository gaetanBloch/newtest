import {
  Controller,
  Get,
  Header,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { NewmanRunSummary } from 'newman';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiProduces } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Header('content-type', 'application/json')
  getResults(): Observable<NewmanRunSummary> {
    return fromPromise(this.appService.getResults('./res/sig-v2.json'));
  }

  @Post('upload-collections')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'collections', maxCount: 100 },
      { name: 'environment', maxCount: 1 },
    ]),
  )
  @ApiProduces('application/html')
  @Header('content-type', 'application/html')
  uploadCollections(@UploadedFiles() files) {
    return this.appService.getResultsFromBlob(
      files.collections[0].buffer.toString(),
      files.environment[0].buffer.toString(),
    );
  }
}
