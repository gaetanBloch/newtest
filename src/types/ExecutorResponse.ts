import { NewmanRunSummary } from 'newman';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

class Response {
  @ApiProperty({
    description: 'Indicates if the test suites has failed',
    required: true,
  })
  failed: boolean;
  @ApiProperty({
    description: 'Number of failures',
    required: true,
  })
  failures: number;
}

class ExecutorResponse {
  @ApiProperty({
    description: 'Simple response',
    required: true,
  })
  response: Response;
  @ApiProperty({
    description: 'HTML report',
    required: false,
  })
  report?: string;
  @ApiProperty({
    description: 'Newman API full response',
    required: false,
  })
  fullResponse?: NewmanRunSummary;
}

export default ExecutorResponse;
