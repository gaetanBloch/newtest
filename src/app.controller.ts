import {
  Body,
  Controller,
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
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiImplicitFile } from '@nestjs/swagger/dist/decorators/api-implicit-file.decorator';

@ApiExtraModels(ExecutorResponse)
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
  @ApiOperation({
    tags: ['test'],
    description: 'Test collection files upload',
  })
  @ApiImplicitFile({
    name: 'collection',
    description: 'Test collection file',
    required: true,
  })
  @ApiImplicitFile({
    name: 'environment',
    description: 'Test environment variables file',
    required: true,
  })
  @ApiImplicitQuery({
    name: 'details',
    required: false,
    type: Boolean,
  })
  @ApiOkResponse({
    schema: {
      oneOf: [{ $ref: getSchemaPath(ExecutorResponse) }],
    },
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
  @ApiOperation({
    tags: ['test'],
    description: 'Test collection strings',
  })
  @ApiImplicitQuery({
    name: 'details',
    required: false,
    type: Boolean,
  })
  @ApiOkResponse({
    schema: {
      oneOf: [{ $ref: getSchemaPath(ExecutorResponse) }],
    },
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
  @ApiOperation({
    tags: ['test'],
    description: 'Test collection file paths',
  })
  @ApiImplicitQuery({
    name: 'collection',
    required: true,
    type: String,
  })
  @ApiImplicitQuery({
    name: 'environment',
    required: true,
    type: String,
  })
  @ApiImplicitQuery({
    name: 'details',
    required: false,
    type: Boolean,
  })
  @ApiOkResponse({
    schema: {
      oneOf: [{ $ref: getSchemaPath(ExecutorResponse) }],
    },
  })
  uploadCollectionPath(
    @Query() collection: string,
    @Query() environment: string,
    @Query() details?: boolean,
  ): Observable<ExecutorResponse> {
    details = !this.isEmpty(details);
    return fromPromise(
      this.appService.getResultsFromBlob(collection, environment, details),
    );
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  private isEmpty = (obj: Object) => {
    return (
      obj &&
      Object.keys(obj).length === 0 &&
      Object.getPrototypeOf(obj) === Object.prototype
    );
  };
}
