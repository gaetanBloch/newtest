import { Injectable } from '@nestjs/common';
import { run } from 'newman';
import * as fs from 'fs';
import ExecutorResponse from './types/ExecutorResponse';

@Injectable()
export class AppService {
  private readonly REPORT_PATH = './res/report.html';

  getResults(
    collection: string,
    environment?: string,
    details?: boolean,
  ): Promise<ExecutorResponse> {
    return new Promise<ExecutorResponse>((resolve, reject) => {
      run(
        {
          collection: collection,
          environment: environment,
          reporters: ['htmlextra', 'cli'],
          reporter: {
            htmlextra: {
              export: this.REPORT_PATH,
            },
          },
        },
        (err, summary) => {
          if (err) reject('error: ' + (err.message ?? 'Unknown error'));

          const failures = summary.run.failures.length;
          let response: ExecutorResponse = {
            response: {
              failed: failures > 0,
              failures,
            },
          };
          if (details) {
            const report = fs.readFileSync(this.REPORT_PATH).toString();
            response = {
              ...response,
              report,
              fullResponse: summary,
            };
          }
          resolve(response);
        },
      );
    });
  }

  getResultsFromBlob(
    collection: string,
    environment?: string,
    details?: boolean,
  ): Promise<ExecutorResponse> {
    const colFile = 'collection.json';
    this.writeFile(colFile, collection);
    const envFile = environment ? 'environment.json' : null;
    environment && this.writeFile(envFile, environment);
    return this.getResults(colFile, envFile, details);
  }

  private writeFile(path: string, content: string): void {
    fs.writeFile(path, content, (err) => {
      if (err) throw new Error('Could not write file: ' + path);
    });
  }
}
