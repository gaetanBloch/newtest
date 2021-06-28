import { Controller, Get, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { Observable } from "rxjs";
import { fromPromise } from "rxjs/internal-compatibility";
import { NewmanRunSummary } from "newman";
import { FileFieldsInterceptor } from "@nestjs/platform-express";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get()
  getResults(): Observable<NewmanRunSummary> {
    return fromPromise(this.appService.getResults('../res/sig-v2.json'));
  }

  @Post('upload-collections')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'collections', maxCount: 100 },
    { name: 'environment', maxCount: 1 }
  ]))
  uploadCollections(@UploadedFiles() files) {
    return fromPromise(this.appService.getResultsFromBlob(
      files.collections[0].buffer.toString(),
      files.environment[0].buffer.toString(),
    ))
  }
}
