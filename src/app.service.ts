import { Injectable } from '@nestjs/common';
import { run, NewmanRunSummary } from 'newman';

@Injectable()
export class AppService {
  async getResults() {
    return this.execCollection();
  }

  private execCollection = (): Promise<NewmanRunSummary> =>
    new Promise<NewmanRunSummary>((resolve, reject) => {
      run({
          collection: require('../res/sig-v2.json'),
          reporters: 'cli',
        }, (err, summary) => {
          if (err) reject('error: ' + err.message ?? 'Unknown error');
          resolve(summary);
        }
      );
    });
}
