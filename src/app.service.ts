import { Injectable } from '@nestjs/common';
import { run, NewmanRunSummary } from 'newman';
import * as fs from 'fs';

@Injectable()
export class AppService {
  getResults(
    collection: string,
    environment?: string,
  ): Promise<NewmanRunSummary> {
    return new Promise<NewmanRunSummary>((resolve, reject) => {
      run(
        {
          collection: collection,
          environment: environment,
          reporters: ['htmlextra', 'cli'],
          reporter: {
            htmlextra: {
              export: './res/report.html',
            },
          },
        },
        (err, summary) => {
          if (err) reject('error: ' + err.message ?? 'Unknown error');
          resolve(summary);
        },
      );
    });
  }

  getReport(
    collection: string,
    environment?: string,
  ): Promise<{ report: string }> {
    return new Promise<{ report: string }>((resolve, reject) => {
      run(
        {
          collection: collection,
          environment: environment,
          reporters: ['htmlextra', 'cli'],
          reporter: {
            htmlextra: {
              export: './res/report.html',
            },
          },
        },
        (err, summary) => {
          if (err) reject('error: ' + err.message ?? 'Unknown error');

          const report = fs.readFileSync('./res/report.html');
          resolve({
            report: report
              .toString()
              .replace(
                '<div class="container">\n' +
                  '            <label>Light</label>\n' +
                  '            <label id="switch" class="switch">\n' +
                  '                <input type="checkbox" onchange="toggleTheme()" id="slider">\n' +
                  '                <span class="slider round"></span>\n' +
                  '            </label>\n' +
                  '            <label>Dark</label>\n' +
                  '        </div>',
                '',
              ),
          });
        },
      );
    });
  }

  getResultsFromBlob(
    collection: string,
    environment: string,
  ): Promise<{ report: string }> {
    const colFile = 'collection.json';
    const envFile = 'environment.json';
    this.writeFile(colFile, collection);
    this.writeFile(envFile, environment);
    return this.getReport(colFile, envFile);
  }

  private writeFile(path: string, content: string): void {
    fs.writeFile(path, content, (err) => {
      if (err) console.error(err);
    });
  }
}
