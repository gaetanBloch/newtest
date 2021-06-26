import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Observable } from "rxjs";
import { fromPromise } from "rxjs/internal-compatibility";
import { NewmanRunSummary } from "newman";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get()
  getResults(): Observable<NewmanRunSummary> {
    return fromPromise(this.appService.getResults());
  }
}
