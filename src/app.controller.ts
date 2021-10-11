import {
  Body,
  Controller,
  Get,
  Header,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import ExecutorRequest from './types/ExecutorRequest';
import ExecutorResponse from './types/ExecutorResponse';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';

@Controller('/api/v1')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Header('content-type', 'application/json')
  @Post('test/files')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'collection', maxCount: 1 },
      { name: 'environment', maxCount: 1 },
    ]),
  )
  @ApiImplicitQuery({
    name: 'details',
    required: false,
    type: Boolean
  })
  uploadCollectionFile(
    @UploadedFiles() files,
    @Query() details?: boolean,
  ): Observable<ExecutorResponse> {
    details = !this.isEmpty(details);
    return fromPromise(
      this.appService.getResultsFromBlob(
        files.collection[0].buffer.toString(),
        files.environment[0].buffer.toString(),
        details,
      ),
    );
  }

  @Header('content-type', 'application/json')
  @Post('test/strings')
  @ApiImplicitQuery({
    name: 'details',
    required: false,
    type: Boolean
  })
  uploadCollectionString(
    @Body() request: ExecutorRequest,
    @Query() details?: boolean,
  ): Observable<ExecutorResponse> {
    details = !this.isEmpty(details);
    return fromPromise(
      this.appService.getResultsFromBlob(
        request.collection,
        request.environment,
        details,
      ),
    );
  }

  @Header('content-type', 'application/json')
  @Post('test/paths')
  @ApiImplicitQuery({
    name: 'details',
    required: false,
    type: Boolean
  })
  uploadCollectionPath(
    @Query() collection: string,
    @Query() environment: string,
    @Query() details?: boolean,
  ): Observable<ExecutorResponse> {
    details = !this.isEmpty(details);
    return fromPromise(
      this.appService.getResultsFromBlob(
        collection,
        environment,
        details,
      ),
    );
  }

  private isEmpty = (obj: Object) => {
    return obj
    && Object.keys(obj).length === 0
    && Object.getPrototypeOf(obj) === Object.prototype
  }
}
